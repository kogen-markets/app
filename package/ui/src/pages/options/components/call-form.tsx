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
import useFormData from "../../../hooks/use-form-data";
import Joi from "joi";
import { useRecoilState } from "recoil";
import { snackbarState } from "../../../state/snackbar";
import { MemoTextField } from "../../../components/memo-textfield";
import useFormValidation from "../../../hooks/use-form-validation";

export const TYPES = {
  ASK: "ask",
  BID: "bid",
};

export const optionSizeValidator = Joi.number();
export const optionPriceValidator = Joi.number();
export const callFormValidator = Joi.object({
  type: Joi.string().allow(...Object.values(TYPES)),
  optionSize: optionSizeValidator,
  optionPrice: optionPriceValidator,
}).unknown(true);

export default function CallForm() {
  const { formState, onChange, setFormState } = useFormData({
    type: TYPES.ASK,
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
  const inProgress = false;

  const isBid = useMemo(() => formState.get("type") === TYPES.BID, [formState]);
  const collateral = useMemo(() => {
    if (formState.get("type") === TYPES.BID) {
      return {
        amount:
          formState.get("optionSize") * (formState.get("optionPrice") + 15),
        denom: "USDT",
      };
    }
    if (formState.get("type") === TYPES.ASK) {
      return {
        amount: formState.get("optionSize"),
        denom: "ATOM",
      };
    }
  }, [formState]);

  return (
    <Fragment>
      <Typography variant="caption">Order type</Typography>
      <ButtonGroup variant="outlined" aria-label="call option" fullWidth>
        <Button
          onClick={() => setFormState((x) => x.set("type", TYPES.ASK))}
          variant={
            formState.get("type") === TYPES.ASK ? "contained" : "outlined"
          }
          disableElevation
        >
          ASK
        </Button>
        <Button
          onClick={() => setFormState((x) => x.set("type", TYPES.BID))}
          variant={
            formState.get("type") === TYPES.BID ? "contained" : "outlined"
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
          <MemoTextField
            error={Boolean(invalidOptionPrice)}
            fullWidth
            helperText={(invalidOptionPrice as string) || " "}
            id="option-price"
            label={"Price"}
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
          <MemoTextField
            error={Boolean(invalidOptionSize)}
            fullWidth
            helperText={(invalidOptionSize as string) || " "}
            id="option-size"
            label={"Size"}
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
            You need to deposit {collateral?.amount} {collateral?.denom}
          </Typography>
        )}
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          size="large"
          sx={{ mt: 2, width: "50%" }}
          onClick={async () => {
            setSnackbar({ message: "Please confirm the transaction" });
            // try {
            //   await updateNotifications(encryptedEmail);
            //   setSnackbar({
            //     message: `Email notification for ${selectedDens} successfully created`,
            //   });
            //   navigate("../");
            // } catch (e: any) {
            //   setSnackbar({
            //     message: "Error creating notifications: " + e.message,
            //   });
            // }
          }}
          color={isBid ? "secondary" : "primary"}
          disabled={inProgress}
        >
          {inProgress ? (
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
