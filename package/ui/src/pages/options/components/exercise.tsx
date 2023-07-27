import { Fragment, useCallback, useMemo, useState } from "react";
import { Button, CircularProgress, InputAdornment } from "@mui/material";
import { snackbarState } from "../../../state/snackbar";
import { useRecoilState, useRecoilValue } from "recoil";
import { MemoTextField } from "../../../components/memo-textfield";
import Joi from "joi";
import useFormValidation from "../../../hooks/use-form-validation";
import { toBaseToken } from "../../../lib/token";
import { useTheme } from "@emotion/react";
import { pythServiceState } from "../../../state/cosmos";
import { useKogenMarketsConfigQuery } from "../../../codegen/KogenMarkets.react-query";
import Decimal from "decimal.js";
import { useExerciseCallOptionMutation } from "../tx";
import WithWallet from "../../../components/with-wallet";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";

export const expiryPriceValidator = Joi.number();

export default function Exercise() {
  const kogenClient = useKogenQueryClient();
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      suspense: true,
    },
  });

  const { mutateAsync: exercise, isLoading: isExerciseLoading } =
    useExerciseCallOptionMutation();

  const [, setSnackbar] = useRecoilState(snackbarState);

  const [expiryPrice, setExpiryPrice] = useState("");
  const [invalidExpiryPrice, setExpiryPriceBlurred] = useFormValidation(
    expiryPrice,
    expiryPriceValidator.messages({}),
  );

  //@ts-ignore
  const isDarkTheme = useTheme().palette.mode === "dark";
  const pythPriceService = useRecoilValue(pythServiceState);

  const pythPriceServicePriceFeed = useMemo(() => {
    pythPriceService.searchParams.set(
      "ids[]",
      config.data?.pyth_base_price_feed || "",
    );

    return pythPriceService;
  }, [config, pythPriceService]);

  const fetchPyth = useCallback(() => {
    fetch(pythPriceServicePriceFeed)
      .then((r) => r.json())
      .then((r) => {
        const { price, expo } = r[0].price;
        const n = new Decimal(price).mul(Math.pow(10, expo)).toFixed(3);

        setExpiryPrice(n);
      });
  }, [pythPriceServicePriceFeed]);

  return (
    <Fragment>
      <MemoTextField
        error={Boolean(invalidExpiryPrice)}
        fullWidth
        helperText={(invalidExpiryPrice as string) || " "}
        label="Expiry price"
        id="option-size"
        name="optionSize"
        onBlur={setExpiryPriceBlurred as any}
        onChange={(event) => setExpiryPrice(event.target.value)}
        required
        color={"secondary"}
        type="number"
        value={expiryPrice}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 3 }}>
              {config.data?.quote_symbol}
            </InputAdornment>
          ),
          endAdornment: (
            <Button
              color="secondary"
              sx={{ height: "100%" }}
              onClick={fetchPyth}
            >
              {isDarkTheme ? (
                <img src="/pyth_logo_lockup_light.svg" width="50" />
              ) : (
                <img src="/pyth_logo_lockup_dark.svg" width="50" />
              )}
            </Button>
          ),
        }}
      />
      <WithWallet WalletButtonProps={{ fullWidth: true, variant: "text" }}>
        <Button
          variant="text"
          size="large"
          fullWidth
          sx={{}}
          onClick={async () => {
            setSnackbar({ message: "Please confirm the transaction" });
            try {
              await exercise({
                expiry_price: toBaseToken(
                  expiryPrice,
                  config.data?.quote_decimals,
                ).toFixed(0),
              });
              setSnackbar({
                message: `Option successfully exercised`,
              });
            } catch (e: any) {
              console.log(e);
              setSnackbar({
                message: "Error exercising the contract: " + e.message,
              });
            }
          }}
          color={"secondary"}
          disabled={isExerciseLoading || !expiryPrice}
        >
          {isExerciseLoading ? (
            <Fragment>
              <CircularProgress size={15} sx={{ mr: 1 }} /> Loading
            </Fragment>
          ) : (
            "Exercise option"
          )}
        </Button>
      </WithWallet>
    </Fragment>
  );
}
