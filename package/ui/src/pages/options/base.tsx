import { Box, Card, Grid, Paper, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { Fragment, Suspense } from "react";
import CallForm from "./components/call-form";
import Orderbook from "./components/order-book";
import Loading from "../../components/loading";
import YourPosition from "./components/your-position";
import Exercise from "./components/exercise";
import OpenOrders from "./components/open-orders";
import { optionTypeState } from "../../state/kogen";

export function BaseOption() {
  const optionType = useRecoilValue(optionTypeState);

  return (
    <Fragment>
      <Typography variant="h4" component="h2" sx={{ mb: { xs: 1, lg: 4 } }}>
        {optionType.toUpperCase()} Option
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="left"
        alignItems="top"
        spacing={4}
      >
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3, minHeight: "450px" }} variant="outlined">
            <Suspense fallback={<Loading />}>
              <CallForm />
            </Suspense>
          </Card>
          <Card sx={{ mt: 4, px: 3, py: 2 }} variant="outlined">
            <Suspense fallback={<Loading />}>
              <YourPosition />
            </Suspense>
          </Card>
          <Card sx={{ mt: 4, px: 3, py: 2 }} variant="outlined">
            <Suspense fallback={<Loading />}>
              <OpenOrders />
            </Suspense>
          </Card>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Paper sx={{ p: 1, minHeight: "450px" }} variant="outlined">
            <Suspense fallback={<Loading />}>
              <Orderbook />
            </Suspense>
          </Paper>
          <Box sx={{ mt: 4 }}>
            <Suspense fallback={<Loading />}>
              <Exercise />
            </Suspense>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}
