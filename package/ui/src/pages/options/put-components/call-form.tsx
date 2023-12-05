import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Fragment, useCallback, useMemo, useRef } from "react";
import { useRecoilState } from "recoil";
import Joi from "joi";
import { ORDER_TYPES } from "../../../types/types";
import { getCallCollateralSize } from "../../../lib/token";
import {
  useKogenMarketsAsksQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import WithWalletConnect from "../../../components/with-wallet";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import useGetAddress from "../../../hooks/use-get-address";
import { openOrderFormState } from "../../../state/kogen";
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
    }, []),
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
    config.data,
  );

  const optionPriceValidatorConfig = useOptionPriceValidatorWithConfig(
    config.data,
  );

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
    Boolean(address) && (isBid ? asks.data?.length : bids.data?.length),
  );

  const { positionInBase, positionInUserRelativeToTheType } = useGetPosition();
  const collateral = useMemo(() => {
    if (!config.data) {
      return null;
    }

    return getCallCollateralSize(
      formState.type,
      config.data,
      formState.optionSize,
      formState.optionPrice,
      positionInUserRelativeToTheType,
    );
  }, [formState, config.data, positionInUserRelativeToTheType]);

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

      <Box>
        <Typography variant="caption">Price and collateral</Typography>
        {Boolean(collateral?.amount) && orderCreateEnabled && (
          <PriceAndCollateral config={configData} />
        )}
      </Box>

      <Box>
        <Balance config={configData} />
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
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item xs={12} md={6}>
              {collateral?.closingSize.gt(0) && (
                <Typography variant="caption">
                  You are closing {collateral?.closingSize.toFixed(3)}{" "}
                  {positionInBase.gt(0) ? "long" : "short"} position
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
                  <SubmitOpenOrder config={configData} />
                ) : (
                  <SubmitClosePositionOrder config={configData} />
                )}
              </WithWalletConnect>
            </Grid>
          </Grid>
        )}
      </Box>
    </Fragment>
  );
}
