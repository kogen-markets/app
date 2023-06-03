import { Fragment, useState } from "react";
import { useInjectiveExerciseCallOptionMutation } from "../tx/injective";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
} from "@mui/material";
import { snackbarState } from "../../../state/snackbar";
import { useRecoilState } from "recoil";
import { MemoTextField } from "../../../components/memo-textfield";
import Joi from "joi";
import useFormValidation from "../../../hooks/use-form-validation";

export const expiryPriceValidator = Joi.number();

export default function Exercise() {
  const { mutateAsync: exercise, isLoading: isExerciseLoading } =
    useInjectiveExerciseCallOptionMutation();

  const [, setSnackbar] = useRecoilState(snackbarState);

  const [expiryPrice, setExpiryPrice] = useState("");
  const [invalidExpiryPrice, setExpiryPriceBlurred] = useFormValidation(
    expiryPrice,
    expiryPriceValidator.messages({})
  );

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
              USDT
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="text"
        size="large"
        fullWidth
        sx={{}}
        onClick={async () => {
          setSnackbar({ message: "Please confirm the transaction" });

          try {
            await exercise({
              expiry_price: "16000000",
            });

            setSnackbar({
              message: `Order successfully created`,
            });
          } catch (e: any) {
            console.log(e);
            setSnackbar({
              message: "Error exercising the contract: " + e.message,
            });
          }
        }}
        color={"secondary"}
        disabled={isExerciseLoading}
      >
        {isExerciseLoading ? (
          <Fragment>
            <CircularProgress size={15} sx={{ mr: 1 }} /> Loading
          </Fragment>
        ) : (
          "Exercise option"
        )}
      </Button>
    </Fragment>
  );
}
