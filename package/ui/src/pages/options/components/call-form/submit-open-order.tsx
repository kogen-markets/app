import { Button, CircularProgress } from "@mui/material";
import { Fragment, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { snackbarState } from "../../../../state/snackbar";
import { Config } from "../../../../codegen/KogenMarkets.types";
import { getCollateralSize, toBaseToken } from "../../../../lib/token";
import { openOrderFormState } from "../../../../state/kogen";
import { useInjectiveCallOptionMutation } from "../../tx/injective"; // Use updated hook
import { useOptionSizeValidatorWithConfig } from "./option-size-input";
import { useOptionPriceValidatorWithConfig } from "./option-price-input";
import Joi from "joi";
import axios from "axios";
import { ORDER_TYPES } from "../../../../types/types";
import {
  walletAddressState,
  prettyNameState,
} from "../../../../state/walletState";

export default function SubmitOpenOrder({
  config,
  isCall,
}: {
  config: Config;
  isCall: boolean;
}) {
  const walletAddress = useRecoilValue(walletAddressState);
  const prettyName = useRecoilValue(prettyNameState);

  const [, setSnackbar] = useRecoilState(snackbarState);
  const formState = useRecoilValue(openOrderFormState);
  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  const { mutateAsync: createOrder, isLoading: isCreateOrderLoading } =
    useInjectiveCallOptionMutation();

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
      const apiUrl = import.meta.env.VITE_KOGEN_APP_API_URL;

      await axios.post(`${apiUrl}/api/trades/save`, {
        ...trade,
        walletAddress,
        prettyName,
      });
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

            const result = await createOrder(order);

            await saveTrade({
              order,
              result: result,
            });

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
