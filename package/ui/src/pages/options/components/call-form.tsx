import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useRecoilState } from "recoil";
import Joi from "joi";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Decimal from "decimal.js";
import useFormData from "../../../hooks/use-form-data";
import { snackbarState } from "../../../state/snackbar";
import { MemoTextField } from "../../../components/memo-textfield";
import useFormValidation from "../../../hooks/use-form-validation";
import { ORDER_TYPES } from "../../../types/types";
import {
  getCollateralSize,
  toBaseToken,
  toUserToken,
} from "../../../lib/token";
import {
  useKogenMarketsAsksQuery,
  useKogenMarketsBidsQuery,
  useKogenMarketsConfigQuery,
} from "../../../codegen/KogenMarkets.react-query";
import { useCallOptionMutation } from "../tx";
import WithWallet from "../../../components/with-wallet";
import useGetBalance from "../../../hooks/use-get-balance";
import useKogenQueryClient from "../../../hooks/use-kogen-query-client";
import useGetAddress from "../../../hooks/use-get-address";
import { externalOpenOrderFormState } from "../../../state/kogen";
import useGetPosition from "../../../hooks/use-get-position";

export const optionSizeValidator = Joi.number().label("Option size");
export const optionPriceValidator = Joi.number().label("Price").greater(0);

export default function CallForm() {
  const callFormRef = useRef<HTMLInputElement>(null);
  const kogenClient = useKogenQueryClient();
  const config = useKogenMarketsConfigQuery({
    client: kogenClient,
    options: {
      staleTime: 300000,
      suspense: true,
    },
  });

  const { formState, onChange, setFormState } = useFormData({
    type: ORDER_TYPES.BID,
    optionSize: 0.1,
    optionPrice: 10,
  });

  const [externalOpenOrderForm, setExternalOpenOrderForm] = useRecoilState(
    externalOpenOrderFormState,
  );
  useEffect(() => {
    if (externalOpenOrderForm?.type) {
      callFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setFormState((x) => x.set("type", externalOpenOrderForm.type));
    }

    if (externalOpenOrderForm?.size) {
      setFormState((x) =>
        x.set("optionSize", externalOpenOrderForm.size?.toNumber()),
      );
    }
  }, [externalOpenOrderForm, setFormState]);

  // reset the external open order form state
  useEffect(() => {
    setExternalOpenOrderForm(null);
  }, [formState, setExternalOpenOrderForm]);

  const optionSizeValidatorConfig = useMemo(() => {
    if (!config.data) {
      return optionSizeValidator;
    }

    return optionSizeValidator
      .min(
        toUserToken(
          config.data.min_order_quantity_in_base,
          config.data.base_decimals,
        ).toNumber(),
      )
      .precision(
        config.data.base_decimals -
          new Decimal(config.data.min_tick_base).log(10).toNumber(),
      );
  }, [config]);

  const optionPriceValidatorConfig = useMemo(() => {
    if (!config.data) {
      return optionSizeValidator;
    }

    return optionPriceValidator.precision(
      config.data.quote_decimals -
        new Decimal(config.data.min_tick_quote).log(10).toNumber(),
    );
  }, [config]);

  const callFormValidatorConfig = useMemo(
    () =>
      Joi.object({
        type: Joi.string().allow(...Object.values(ORDER_TYPES)),
        optionSize: optionSizeValidatorConfig,
        optionPrice: optionPriceValidatorConfig,
      }).unknown(true),
    [optionSizeValidatorConfig, optionPriceValidatorConfig],
  );

  const [invalidOptionSize, setOptionSizeBlurred] = useFormValidation(
    formState.get("optionSize"),
    optionSizeValidatorConfig.messages({}),
    { validateAfterBlur: false, validateAfterChange: true },
  );

  const [invalidOptionPrice, setOptionPriceBlurred] = useFormValidation(
    formState.get("optionPrice"),
    optionPriceValidatorConfig.messages({}),
    { validateAfterBlur: false, validateAfterChange: true },
  );

  const [, setSnackbar] = useRecoilState(snackbarState);

  const isBid = useMemo(
    () => formState.get("type") === ORDER_TYPES.BID,
    [formState],
  );

  const orderCreateEnabled = useMemo(() => {
    return (
      callFormValidatorConfig.validate(formState.toJSON(), { convert: false })
        .error == null
    );
  }, [callFormValidatorConfig, formState]);

  const { mutateAsync: createOrder, isLoading: isCreateOrderLoading } =
    useCallOptionMutation();

  const balance = useGetBalance(
    undefined,
    isBid ? config.data?.quote_denom : config.data?.base_denom,
  );

  const address = useGetAddress();

  const bids = useKogenMarketsBidsQuery({
    client: kogenClient,
    args: {
      sender: address,
    },
    options: {
      suspense: true,
    },
  });

  const asks = useKogenMarketsAsksQuery({
    client: kogenClient,
    args: {
      sender: address,
    },
    options: {
      suspense: true,
    },
  });

  const positionInBase = useGetPosition();
  const positionInUser = useMemo(
    () => toUserToken(positionInBase, config.data?.base_decimals),
    [positionInBase, config],
  );
  const positionRelativeToTheType = useMemo(() => {
    if (
      (positionInUser.lt(0) && formState.get("type") === ORDER_TYPES.BID) ||
      (positionInUser.gt(0) && formState.get("type") === ORDER_TYPES.ASK)
    ) {
      return positionInUser.abs();
    }

    return new Decimal(0);
  }, [positionInUser, formState]);

  const isOrderSizeLessThanPosition = useMemo(() => {
    if (positionRelativeToTheType.eq(0)) {
      return false;
    }

    return positionRelativeToTheType.gt(formState.get("optionSize"));
  }, [positionRelativeToTheType, formState]);

  const isOrderSizeEqPosition = useMemo(() => {
    if (positionRelativeToTheType.eq(0)) {
      return false;
    }

    return positionRelativeToTheType.eq(formState.get("optionSize"));
  }, [positionRelativeToTheType, formState]);

  const isOpenOrderInOppositeDirection = Boolean(
    isBid ? asks.data?.length : bids.data?.length,
  );

  const collateral = useMemo(() => {
    if (!config.data) {
      return null;
    }

    return getCollateralSize(
      formState.get("type"),
      config.data,
      formState.get("optionSize"),
      formState.get("optionPrice"),
      positionRelativeToTheType,
    );
  }, [formState, config.data, positionRelativeToTheType]);

  return (
    <Fragment>
      <Typography variant="caption" ref={callFormRef}>
        Order type
      </Typography>
      <ButtonGroup variant="outlined" aria-label="call option" fullWidth>
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
        <Button
          onClick={() => setFormState((x) => x.set("type", ORDER_TYPES.ASK))}
          variant={
            formState.get("type") === ORDER_TYPES.ASK ? "contained" : "outlined"
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
          {config.data?.strike_price_in_quote && (
            <Fragment>
              <Typography variant="caption">Strike</Typography>
              <Typography variant="body1">
                $
                {toUserToken(
                  config.data?.strike_price_in_quote,
                  config.data?.quote_decimals,
                ).toFixed(2)}
              </Typography>
            </Fragment>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {config.data?.expiry && (
            <Fragment>
              <Typography variant="caption">Expiry</Typography>
              <Typography variant="body1">
                {new Date(
                  parseInt(config.data.expiry) / 1000000,
                ).toLocaleDateString(undefined, {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Typography>
            </Fragment>
          )}
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
            FormHelperTextProps={{
              sx: {
                minHeight: { md: "60px" },
                display: "block",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 3 }}>
                  {config.data?.quote_symbol}
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
            FormHelperTextProps={{
              sx: {
                minHeight: { md: "60px" },
                display: "block",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 3 }}>
                  {config.data?.base_symbol}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="caption">Collateral</Typography>
        {Boolean(collateral?.amount) && orderCreateEnabled && (
          <Fragment>
            <Typography
              variant="body1"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              You need to deposit {collateral?.amount?.toPrecision(4)}{" "}
              {collateral?.symbol}
              {isBid && (
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
                          <span>Option price:</span>
                          <span>
                            {collateral.optionAmount.toFixed(2)}{" "}
                            {collateral?.symbol}
                          </span>
                        </Typography>
                      )}{" "}
                      <Typography
                        variant="caption"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        <span>Strike price collateral: </span>
                        <span>
                          {collateral?.strikeAmount.toFixed(2)}{" "}
                          {collateral?.symbol}
                        </span>
                      </Typography>
                      {collateral?.closingSize.gt(0) && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <span>
                            Closing {isBid ? "ask" : "bid"} position:{" "}
                          </span>
                          <span>{collateral?.closingSize.toFixed(3)}</span>
                        </Typography>
                      )}
                    </Fragment>
                  }
                >
                  <HelpOutlineIcon fontSize="small" />
                </Tooltip>
              )}
            </Typography>
          </Fragment>
        )}
      </Box>

      <Box>
        <Typography variant="caption">Available</Typography>
        {balance.data?.amount &&
          (isBid ? (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {toUserToken(
                balance.data.amount,
                config.data?.quote_decimals,
              ).toFixed(2)}
              {config.data?.quote_symbol}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {toUserToken(
                balance.data.amount,
                config.data?.base_decimals,
              ).toFixed(2)}
              {config.data?.base_symbol}
            </Typography>
          ))}
      </Box>

      <Divider sx={{ mt: 2 }} />
      <Box sx={{ pt: 2 }}>
        {isOpenOrderInOppositeDirection && (
          <Fragment>
            <Alert
              severity="warning"
              variant="outlined"
              sx={{ textAlign: "initial" }}
            >
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
              <WithWallet
                WalletButtonProps={{
                  color: isBid ? "secondary" : "primary",
                  size: "large",
                  fullWidth: true,
                }}
              >
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
                      await createOrder({
                        type: formState.get("type"),
                        price: toBaseToken(
                          formState.get("optionPrice"),
                          config.data?.quote_decimals,
                        ).toFixed(0),
                        quantity: toBaseToken(
                          formState.get("optionSize"),
                          config.data?.base_decimals,
                        ).toFixed(0),
                        closing_position: toBaseToken(
                          collateral.closingSize,
                          config.data?.base_decimals,
                        ).toFixed(0),
                        funds: [
                          {
                            amount: collateral.amountBase,
                            denom: collateral.denom,
                          },
                        ],
                      });

                      setSnackbar({
                        message: `Order successfully created`,
                      });
                    } catch (e: any) {
                      if (
                        e?.originalMessage?.includes("Matched own position")
                      ) {
                        setSnackbar({
                          message:
                            "Matched your own position, the order is rejected",
                        });

                        return;
                      }
                      setSnackbar({
                        message: "Error creating order: " + e.message,
                      });
                    }
                  }}
                  color={isBid ? "secondary" : "primary"}
                  disabled={isCreateOrderLoading || !orderCreateEnabled}
                >
                  {isOrderSizeEqPosition &&
                    `Close ${isBid ? "ask" : "bid"} position`}
                  {isOrderSizeLessThanPosition &&
                    `Reduce ${isBid ? "ask" : "bid"} position`}
                  {!isOrderSizeEqPosition &&
                    !isOrderSizeLessThanPosition &&
                    (isCreateOrderLoading ? (
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
                    ))}
                </Button>
              </WithWallet>
            </Grid>
          </Grid>
        )}
      </Box>
    </Fragment>
  );
}
