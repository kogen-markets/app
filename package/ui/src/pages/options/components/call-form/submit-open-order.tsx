import { Button, CircularProgress } from "@mui/material";
import { Fragment, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { snackbarState } from "../../../../state/snackbar";
import { Config } from "../../../../codegen/KogenMarkets.types";
import { getCollateralSize, toBaseToken } from "../../../../lib/token";
import { openOrderFormState } from "../../../../state/kogen";
import { useCallOptionMutation } from "../../tx";
import { useOptionSizeValidatorWithConfig } from "./option-size-input";
import { useOptionPriceValidatorWithConfig } from "./option-price-input";
import Joi from "joi";
import axios from "axios";
import { ORDER_TYPES } from "../../../../types/types";

export default function SubmitOpenOrder({
  config,
  isCall,
}: {
  config: Config;
  isCall: boolean;
}) {
  const [, setSnackbar] = useRecoilState(snackbarState);
  const formState = useRecoilValue(openOrderFormState);
  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  const { mutateAsync: createOrder, isLoading: isCreateOrderLoading } =
    useCallOptionMutation();

  const collateral = useMemo(() => {
    return getCollateralSize(
      isCall,
      formState.type,
      config,
      formState.optionSize,
      formState.optionPrice
    );
  }, [isCall, formState, config]);

  const optionSizeValidatorConfig = useOptionSizeValidatorWithConfig(config);
  const optionPriceValidatorConfig = useOptionPriceValidatorWithConfig(config);

  const callFormValidatorConfig = useMemo(
    () =>
      Joi.object({
        type: Joi.string().allow(...Object.values(ORDER_TYPES)),
        optionSize: optionSizeValidatorConfig,
        optionPrice: optionPriceValidatorConfig,
      }).unknown(true),
    [optionSizeValidatorConfig, optionPriceValidatorConfig]
  );

  const orderCreateEnabled = useMemo(() => {
    return (
      callFormValidatorConfig.validate(formState, { convert: false }).error ==
      null
    );
  }, [callFormValidatorConfig, formState]);

  const saveTrade = async (trade: any) => {
    try {
      const apiUrl = process.env.KOGEN_APP_API_URL || "http://localhost:3000";
      await axios.post(`${apiUrl}/api/trades/save`, trade);
      setSnackbar({ message: "Trade successfully saved!" });
    } catch (error: any) {
      setSnackbar({ message: "Error saving trade: " + error.message });
    }
  };

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
            const order = {
              type: formState.type,
              price: toBaseToken(
                formState.optionPrice,
                config.quote_decimals
              ).toFixed(0),
              quantity: toBaseToken(
                formState.optionSize,
                config.base_decimals
              ).toFixed(0),
              funds: [
                {
                  amount: collateral.amountBase,
                  denom: collateral.denom,
                },
              ],
            };

            // Create the order
            await createOrder(order);

            // Save the trade to the backend
            await saveTrade(order);

            setSnackbar({ message: `Order successfully created` });
          } catch (e: any) {
            if (e?.originalMessage?.includes("Matched own position")) {
              setSnackbar({
                message: "Matched your own position, the order is rejected",
              });
              return;
            }
            setSnackbar({ message: "Error creating order: " + e.message });
            throw e.originalMessage;
          }
        }}
        color={isBid ? "secondary" : "primary"}
        disabled={isCreateOrderLoading || !orderCreateEnabled}
      >
        {isCreateOrderLoading ? (
          <Fragment>
            <CircularProgress
              size={15}
              sx={{ mr: 1 }}
              color={isBid ? "secondary" : "primary"}
            />{" "}
            Loading
          </Fragment>
        ) : (
          `Create ${isBid ? "bid" : "ask"} order`
        )}
      </Button>
    </Fragment>
  );
}
