import { InputAdornment, Typography } from "@mui/material";
import { Fragment, useMemo } from "react";
import Joi from "joi";
import Decimal from "decimal.js";
import { useRecoilState } from "recoil";

import { MemoTextField } from "../../../../components/memo-textfield";
import useFormValidation from "../../../../hooks/use-form-validation";
import { openOrderFormState } from "../../../../state/kogen";
import useOnChange from "../../../../hooks/use-on-change";
import { ORDER_TYPES } from "../../../../types/types";
import { Config } from "../../../../codegen/KogenMarkets.types";

export const optionPriceValidator = Joi.number().label("Price").greater(0);

export function useOptionPriceValidatorWithConfig(config?: Config) {
  const optionPriceValidatorConfig = useMemo(() => {
    if (!config) {
      return optionPriceValidator;
    }

    return optionPriceValidator.precision(
      config.quote_decimals -
        new Decimal(config.min_tick_quote).log(10).toNumber(),
    );
  }, [config]);

  return optionPriceValidatorConfig;
}

export default function OptionPriceInput({ config }: { config: Config }) {
  const optionPriceValidatorConfig = useOptionPriceValidatorWithConfig(config);

  const [formState, setFormState] = useRecoilState(openOrderFormState);
  const onChange = useOnChange(setFormState);

  const [invalidOptionPrice, setOptionPriceBlurred] = useFormValidation(
    formState.optionPrice,
    optionPriceValidatorConfig.messages({}),
    { validateAfterBlur: false, validateAfterChange: true },
  );

  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  return (
    <Fragment>
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
        value={formState.optionPrice}
        variant="outlined"
        FormHelperTextProps={{
          sx: {
            minHeight: { md: "60px" },
            display: "block",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 3 }}>
              {config.quote_symbol}
            </InputAdornment>
          ),
        }}
      />
    </Fragment>
  );
}
