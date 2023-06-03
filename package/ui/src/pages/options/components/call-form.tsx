import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Joi from "joi";
import useFormData from "../../../hooks/use-form-data";
import { snackbarState } from "../../../state/snackbar";
import { MemoTextField } from "../../../components/memo-textfield";
import useFormValidation from "../../../hooks/use-form-validation";
import { useInjectiveCallOptionMutation } from "../tx/injective";
import { ORDER_TYPES } from "../../../types/types";
import { kogenMarketsQueryClientState } from "../../../state/kogen";
import { toBaseToken, toUserToken } from "../../../lib/token";
import useTryNextClient from "../../../hooks/use-try-next-client";
import { useKogenMarketsConfigQuery } from "../../../codegen/KogenMarkets.react-query";

export const optionSizeValidator = Joi.number();
export const optionPriceValidator = Joi.number();
export const callFormValidator = Joi.object({
  type: Joi.string().allow(...Object.values(ORDER_TYPES)),
  optionSize: optionSizeValidator,
  optionPrice: optionPriceValidator,
}).unknown(true);

export default function CallForm() {
  const tryNextClient = useTryNextClient();
  const kogenClient = useRecoilValue(kogenMarketsQueryClientState);
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      onError: tryNextClient,
      suspense: true,
    },
  });

  const { formState, onChange, setFormState } = useFormData({
    type: ORDER_TYPES.BID,
    optionSize: 0.1,
    optionPrice: 10,
  });

  const [invalidOptionSize, setOptionSizeBlurred] = useFormValidation(
    formState.get("optionSize"),
    optionSizeValidator.messages({})
  );

  const [invalidOptionPrice, setOptionPriceBlurred] = useFormValidation(
    formState.get("optionPrice"),
    optionSizeValidator.messages({})
  );

  const [, setSnackbar] = useRecoilState(snackbarState);

  const isBid = useMemo(
    () => formState.get("type") === ORDER_TYPES.BID,
    [formState]
  );

  const collateral = useMemo(() => {
    if (!config.data) {
      return null;
    }

    if (formState.get("type") === ORDER_TYPES.BID) {
      const amount_in_base = toBaseToken(
        formState.get("optionPrice"),
        config.data.quote_decimals
      )
        .add(config.data.strike_price_in_quote)
        .mul(formState.get("optionSize"));

      return {
        amountBase: amount_in_base.toFixed(0),
        amount: toUserToken(amount_in_base, config.data.quote_decimals),
        denom: config.data.quote_denom,
        symbol: "USDT",
      };
    }

    if (formState.get("type") === ORDER_TYPES.ASK) {
      const amount_in_base = toBaseToken(
        formState.get("optionSize"),
        config.data.base_decimals
      );

      return {
        amountBase: amount_in_base.toFixed(0),
        amount: toUserToken(amount_in_base, config.data.base_decimals),
        denom: config.data.base_denom,
        symbol: "ATOM",
      };
    }
  }, [formState, config.data]);

  const { mutateAsync: createOrder, isLoading: isCreateOrderLoading } =
    useInjectiveCallOptionMutation();

  return (
    <Fragment>
      <Typography variant="caption">Order type</Typography>
      <ButtonGroup variant="outlined" aria-label="call option" fullWidth>
        <Button
          onClick={() => setFormState((x) => x.set("type", ORDER_TYPES.BID))}
          variant={
            formState.get("type") === ORDER_TYPES.BID ? "contained" : "outlined"
          }
          color="secondary"
          disableElevation
        >
          BID
        </Button>
        <Button
          onClick={() => setFormState((x) => x.set("type", ORDER_TYPES.ASK))}
          variant={
            formState.get("type") === ORDER_TYPES.ASK ? "contained" : "outlined"
          }
          disableElevation
        >
          ASK
        </Button>
      </ButtonGroup>
      <Divider sx={{ my: 2 }} />
      <Grid
        container
        direction="row"
        justifyContent="left"
        alignItems="center"
        spacing={3}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} sm={6}>
          {config.data?.strike_price_in_quote && (
            <Fragment>
              <Typography variant="caption">Strike</Typography>
              <Typography variant="body1">
                $
                {toUserToken(
                  config.data?.strike_price_in_quote,
                  config.data?.quote_decimals
                ).toFixed(2)}
              </Typography>
            </Fragment>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Expiry</Typography>
          <Typography variant="body1">15-Sep-2023</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="left"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Price</Typography>
          <MemoTextField
            error={Boolean(invalidOptionPrice)}
            fullWidth
            helperText={(invalidOptionPrice as string) || " "}
            id="option-price"
            name="optionPrice"
            onBlur={setOptionPriceBlurred as any}
            onChange={onChange as any}
            required
            color={isBid ? "secondary" : "primary"}
            type="number"
            value={formState.get("optionPrice")}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 3 }}>
                  USDT
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">Size</Typography>
          <MemoTextField
            error={Boolean(invalidOptionSize)}
            fullWidth
            helperText={(invalidOptionSize as string) || " "}
            id="option-size"
            name="optionSize"
            onBlur={setOptionSizeBlurred as any}
            onChange={onChange as any}
            required
            color={isBid ? "secondary" : "primary"}
            type="number"
            value={formState.get("optionSize")}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 3 }}>
                  ATOM
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="caption">Collateral</Typography>
        {Boolean(collateral?.amount) && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            You need to deposit {collateral?.amount?.toPrecision(4)}{" "}
            {collateral?.symbol}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mt: 2 }} />
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ mt: 2, width: { xs: "100%", lg: "50%" } }}
          onClick={async () => {
            setSnackbar({ message: "Please confirm the transaction" });
            if (!collateral) {
              return null;
            }

            try {
              await createOrder({
                type: formState.get("type"),
                price: toBaseToken(
                  formState.get("optionPrice"),
                  config.data?.quote_decimals
                ).toFixed(0),
                quantity: toBaseToken(
                  formState.get("optionSize"),
                  config.data?.base_decimals
                ).toFixed(0),
                funds: [
                  {
                    amount: collateral.amountBase,
                    denom: collateral.denom,
                  },
                ],
              });

              setSnackbar({
                message: `Order successfully created`,
              });
            } catch (e: any) {
              setSnackbar({
                message: "Error creating order: " + e.message,
              });
            }
          }}
          color={isBid ? "secondary" : "primary"}
          disabled={isCreateOrderLoading}
        >
          {isCreateOrderLoading ? (
            <Fragment>
              <CircularProgress size={15} sx={{ mr: 1 }} /> Loading
            </Fragment>
          ) : (
            `Create ${isBid ? "bid" : "ask"} order`
          )}
        </Button>
      </Box>
    </Fragment>
  );
}
