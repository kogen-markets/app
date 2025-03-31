import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useCallback, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Joi from "joi";
import { ORDER_TYPES } from "../../../types/types";
import { calculateFeePerc, getCollateralSize } from "../../../lib/token";
import {
  useKogenMarketsAsksQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import WithWalletConnect from "../../../components/with-wallet";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import useGetAddress from "../../../hooks/use-get-address";
import { isCallOptionState, openOrderFormState } from "../../../state/kogen";
import useGetPosition from "../../../hooks/use-get-position";
import StrikePrice from "./call-form/strike-price";
import Expiry from "./call-form/expiry";
import OptionPriceInput, {
  useOptionPriceValidatorWithConfig,
} from "./call-form/option-price-input";
import OptionSizeInput, {
  useOptionSizeValidatorWithConfig,
} from "./call-form/option-size-input";
import PriceAndCollateral from "./call-form/final-price";
import Balance from "./call-form/balance";
import SubmitOpenOrder from "./call-form/submit-open-order";
import SubmitClosePositionOrder from "./call-form/submit-close-position-order";
import useCustomEventListener, {
  GLOBAL_CUSTOM_EVENTS,
} from "../../../hooks/use-event-listener";
import PythPrice from "./call-form/spot-price";

export const optionSizeValidator = Joi.number().label("Option size");
export const optionPriceValidator = Joi.number().label("Price").greater(0);

export default function CallForm() {
  const callFormRef = useRef<HTMLInputElement>(null);
  useCustomEventListener(
    GLOBAL_CUSTOM_EVENTS.SCROLL_CALL_FORM_INTO_VIEW,
    useCallback(() => {
      callFormRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, [])
  );

  const kogenClient = useKogenQueryClient();
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      suspense: true,
    },
  });
  const configData = config.data!;

  const [formState, setFormState] = useRecoilState(openOrderFormState);
  const isBid = useMemo(() => formState.type === ORDER_TYPES.BID, [formState]);

  const optionSizeValidatorConfig = useOptionSizeValidatorWithConfig(
    config.data
  );

  const optionPriceValidatorConfig = useOptionPriceValidatorWithConfig(
    config.data
  );

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

  const address = useGetAddress();

  const bids = useKogenMarketsBidsQuery({
    client: kogenClient,
    args: {
      sender: address,
    },
    options: {
      staleTime: 1000,
      suspense: true,
    },
  });
  const asks = useKogenMarketsAsksQuery({
    client: kogenClient,
    args: {
      sender: address,
    },
    options: {
      staleTime: 1000,
      suspense: true,
    },
  });
  const isOpenOrderInOppositeDirection = Boolean(
    Boolean(address) && (isBid ? asks.data?.length : bids.data?.length)
  );

  const isCall = useRecoilValue(isCallOptionState);
  const { positionInBase, positionInUserRelativeToTheType } = useGetPosition();
  const collateral = useMemo(() => {
    if (!config.data) {
      return null;
    }

    return getCollateralSize(
      isCall,
      formState.type,
      config.data,
      formState.optionSize,
      formState.optionPrice,
      positionInUserRelativeToTheType
    );
  }, [isCall, formState, config.data, positionInUserRelativeToTheType]);

  return (
    <Fragment>
      <Typography
        variant="caption"
        ref={callFormRef}
        // scroll into view offset
        sx={{ mt: "-30px", pt: "30px" }}
      >
        Order type
      </Typography>
      <ButtonGroup variant="outlined" aria-label="call option" fullWidth>
        <Button
          onClick={() => setFormState((x) => ({ ...x, type: ORDER_TYPES.BID }))}
          variant={
            formState.type === ORDER_TYPES.BID ? "contained" : "outlined"
          }
          color="secondary"
          disableElevation
        >
          BID
        </Button>
        <Button
          onClick={() => setFormState((x) => ({ ...x, type: ORDER_TYPES.ASK }))}
          variant={
            formState.type === ORDER_TYPES.ASK ? "contained" : "outlined"
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
          <StrikePrice config={configData} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Expiry config={configData} />
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
          <OptionPriceInput config={configData} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <OptionSizeInput config={configData} />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          alignItems: "center",
          gap: 2,
        }}
      >
        {Boolean(collateral?.amount) && orderCreateEnabled && (
          <Box>
            <Typography variant="caption">Price and collateral</Typography>
            <PriceAndCollateral isCall={isCall} config={configData} />
          </Box>
        )}
        <Grid item xs={12} sm={4}>
          <PythPrice config={configData} />
        </Grid>
      </Box>

      <Box>
        <Balance isCall={isCall} config={configData} />
      </Box>

      <Divider sx={{ mt: 2 }} />
      <Box sx={{ pt: 2 }}>
        {isOpenOrderInOppositeDirection && (
          <Fragment>
            <Alert severity="warning" variant="outlined">
              <AlertTitle>Cannot create a new order</AlertTitle>
              <span>
                Please{" "}
                <strong>
                  cancel outstanding {isBid ? "ask" : "bid"} orders
                </strong>
              </span>
            </Alert>
          </Fragment>
        )}
        {!isOpenOrderInOppositeDirection && (
          <Grid
            container
            spacing={2}
            alignItems={"baseline"}
            justifyContent={"space-between"}
          >
            <Grid item xs={12} md={6}>
              {collateral?.closingSize.gt(0) && (
                <Typography variant="caption" display="block">
                  You are closing {collateral?.closingSize.toFixed(3)}{" "}
                  {positionInBase.gt(0) ? "long" : "short"} position
                </Typography>
              )}
              {orderCreateEnabled && (
                <Typography
                  variant="caption"
                  display="flex"
                  alignItems={"center"}
                >
                  Protocol fee {calculateFeePerc(configData).toFixed(2)}%{" "}
                  {collateral?.refundableFeeAmount?.gt(0) && (
                    <Tooltip
                      enterTouchDelay={0}
                      title={
                        <Fragment>
                          {collateral?.optionAmount && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <span>
                                Fees are paid by the user who submits the
                                matching order (the “taker”). If your order is
                                not the matching one, the fee is sent back
                                within the same transaction.
                              </span>
                            </Typography>
                          )}{" "}
                        </Fragment>
                      }
                    >
                      <HelpOutlineIcon sx={{ fontSize: "1em", ml: 0.5 }} />
                    </Tooltip>
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <WithWalletConnect
                WalletButtonProps={{
                  color: isBid ? "secondary" : "primary",
                  size: "large",
                  fullWidth: true,
                }}
              >
                {positionInUserRelativeToTheType.eq(0) ? (
                  <SubmitOpenOrder isCall={isCall} config={configData} />
                ) : (
                  <SubmitClosePositionOrder
                    isCall={isCall}
                    config={configData}
                  />
                )}
              </WithWalletConnect>
            </Grid>
          </Grid>
        )}
      </Box>
    </Fragment>
  );
}
