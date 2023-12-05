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
import { toUserToken } from "../../../../lib/token";
import { Config } from "../../../../codegen/KogenMarkets.types";
import useGetPosition from "../../../../hooks/use-get-position";

export const optionSizeValidator = Joi.number().label("Option size");
export function useOptionSizeValidatorWithConfig(
  config?: Config,
  max?: Decimal,
) {
  const optionSizeValidatorConfig = useMemo(() => {
    if (!config) {
      return optionSizeValidator;
    }

    let validatorWithConfigUpdate = optionSizeValidator
      .min(
        toUserToken(
          config.min_order_quantity_in_base,
          config.base_decimals,
        ).toNumber(),
      )
      .precision(
        config.base_decimals -
          new Decimal(config.min_tick_base).log(10).toNumber(),
      );

    if (max?.gt(0)) {
      validatorWithConfigUpdate = validatorWithConfigUpdate.max(max.toNumber());
    }

    return validatorWithConfigUpdate;
  }, [config, max]);

  return optionSizeValidatorConfig;
}

export default function OptionSizeInput({ config }: { config: Config }) {
  const { positionInUserRelativeToTheType } = useGetPosition();

  const optionSizeValidatorConfig = useOptionSizeValidatorWithConfig(
    config,
    positionInUserRelativeToTheType,
  );

  const [formState, setFormState] = useRecoilState(openOrderFormState);
  const onChange = useOnChange(setFormState);

  const [invalidOptionSize, setOptionSizeBlurred] = useFormValidation(
    formState.optionSize,
    optionSizeValidatorConfig.messages({}),
    { validateAfterBlur: false, validateAfterChange: true },
  );

  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  return (
    <Fragment>
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
        value={formState.optionSize}
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
              {config.base_symbol}
            </InputAdornment>
          ),
        }}
      />
    </Fragment>
  );
}
