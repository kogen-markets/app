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
import { useKogenMarketsConfigQuery } from "../../../codegen/KogenMarkets.react-query";
import useTryNextClient from "../../../hooks/use-try-next-client";

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

  const { formState, onChange, setFormState } = useFormData({
    type: ORDER_TYPES.ASK,
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
    if (formState.get("type") === ORDER_TYPES.BID) {
      return {
        amount:
          formState.get("optionSize") * (formState.get("optionPrice") + 15),
        denom: "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5",
        symbol: "USDT",
      };
    }
    if (formState.get("type") === ORDER_TYPES.ASK) {
      return {
        amount: formState.get("optionSize"),
        denom: "factory/inj17vytdwqczqz72j65saukplrktd4gyfme5agf6c/atom",
        symbol: "ATOM",
      };
    }
  }, [formState]);

  const { mutateAsync: createOrder, isLoading: isCreateOrderLoading } =
    useInjectiveCallOptionMutation();

  return (
    <Fragment>
      <Typography variant="caption">Order type</Typography>
      <ButtonGroup variant="outlined" aria-label="call option" fullWidth>
        <Button
          onClick={() => setFormState((x) => x.set("type", ORDER_TYPES.ASK))}
          variant={
            formState.get("type") === ORDER_TYPES.ASK ? "contained" : "outlined"
          }
          disableElevation
        >
          ASK
        </Button>
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
          <Typography variant="caption">Strike</Typography>
          <Typography variant="body1">$15.00</Typography>
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
                price: "" + Math.ceil(formState.get("optionPrice") * 1e6),
                quantity: "" + Math.ceil(formState.get("optionSize") * 1e6),
                funds: [
                  {
                    amount: "" + Math.ceil(collateral.amount * 1e6),
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
