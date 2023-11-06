import { Button, CircularProgress } from "@mui/material";
import { Fragment, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { snackbarState } from "../../../../state/snackbar";
import { Config } from "../../../../codegen/KogenMarkets.types";
import { getCollateralSize, toBaseToken } from "../../../../lib/token";
import { openOrderFormState } from "../../../../state/kogen";
import { useClosePositionOrderMutation } from "../../tx";
import { useOptionSizeValidatorWithConfig } from "./option-size-input";
import { useOptionPriceValidatorWithConfig } from "./option-price-input";
import Joi from "joi";
import { ORDER_TYPES } from "../../../../types/types";
import useGetPosition from "../../../../hooks/use-get-position";

export default function SubmitClosePositionOrder({
  config,
}: {
  config: Config;
}) {
  const [, setSnackbar] = useRecoilState(snackbarState);
  const formState = useRecoilValue(openOrderFormState);
  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  const { mutateAsync: closePositionOrder, isLoading: isClosePositionLoading } =
    useClosePositionOrderMutation();

  const { positionInUserRelativeToTheType } = useGetPosition();

  const isOrderSizeLessThanPosition = useMemo(() => {
    if (positionInUserRelativeToTheType.eq(0)) {
      return false;
    }

    return positionInUserRelativeToTheType.gt(formState.optionSize);
  }, [positionInUserRelativeToTheType, formState]);

  const isOrderSizeEqPosition = useMemo(() => {
    if (positionInUserRelativeToTheType.eq(0)) {
      return false;
    }

    return positionInUserRelativeToTheType.eq(formState.optionSize);
  }, [positionInUserRelativeToTheType, formState]);

  const isOrderSizeGreaterThanPosition = useMemo(() => {
    if (positionInUserRelativeToTheType.eq(0)) {
      return false;
    }

    return positionInUserRelativeToTheType.lt(formState.optionSize);
  }, [positionInUserRelativeToTheType, formState]);

  const collateral = useMemo(() => {
    return getCollateralSize(
      formState.type,
      config,
      formState.optionSize,
      formState.optionPrice,
      positionInUserRelativeToTheType,
    );
  }, [formState, config, positionInUserRelativeToTheType]);

  const optionSizeValidatorConfig = useOptionSizeValidatorWithConfig(
    config,
    positionInUserRelativeToTheType,
  );
  const optionPriceValidatorConfig = useOptionPriceValidatorWithConfig(config);

  const callFormValidatorConfig = useMemo(
    () =>
      Joi.object({
        type: Joi.string().allow(...Object.values(ORDER_TYPES)),
        optionSize: optionSizeValidatorConfig,
        optionPrice: optionPriceValidatorConfig,
      }).unknown(true),
    [optionSizeValidatorConfig, optionPriceValidatorConfig],
  );

  const orderCreateEnabled = useMemo(() => {
    return (
      callFormValidatorConfig.validate(formState, { convert: false }).error ==
      null
    );
  }, [callFormValidatorConfig, formState]);

  return (
    <Fragment>
      <Button
        variant="outlined"
        size="large"
        fullWidth
        onClick={async () => {
          setSnackbar({ message: "Please confirm the transaction" });

          if (!collateral) {
            return null;
          }

          try {
            await closePositionOrder({
              type: formState.type,
              price: toBaseToken(
                formState.optionPrice,
                config.quote_decimals,
              ).toFixed(0),
              quantity: toBaseToken(
                formState.optionSize,
                config.base_decimals,
              ).toFixed(0),
              funds: [
                {
                  amount: collateral.amountBase,
                  denom: collateral.denom,
                },
              ],
            });

            setSnackbar({
              message: `Close position order successfully created`,
            });
          } catch (e: any) {
            if (e?.originalMessage?.includes("Matched own position")) {
              setSnackbar({
                message: "Matched your own position, the order is rejected",
              });

              return;
            }
            setSnackbar({
              message: "Error creating close position order: " + e.message,
            });
          }
        }}
        color={isBid ? "secondary" : "primary"}
        disabled={isClosePositionLoading || !orderCreateEnabled}
      >
        {isClosePositionLoading ? (
          <Fragment>
            <CircularProgress
              size={15}
              sx={{ mr: 1 }}
              color={isBid ? "secondary" : "primary"}
            />{" "}
            Loading
          </Fragment>
        ) : (
          <Fragment>
            {isOrderSizeEqPosition && `Close ${isBid ? "ask" : "bid"} position`}
            {isOrderSizeLessThanPosition &&
              `Reduce ${isBid ? "ask" : "bid"} position`}
            {isOrderSizeGreaterThanPosition && `Cannot close position`}
          </Fragment>
        )}
      </Button>
    </Fragment>
  );
}
