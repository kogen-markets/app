import { Card, Grid, Typography } from "@mui/material";

import { Fragment, Suspense } from "react";
import CallForm from "./components/call-form";
import Orderbook from "./components/order-book";
import Loading from "../../components/loading";

export default function Options() {
  return (
    <Fragment>
      <Typography variant="h4" component="h2" sx={{ mb: { xs: 1, lg: 4 } }}>
        Call Options
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="left"
        alignItems="top"
        spacing={4}
      >
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3 }} variant="outlined">
            <CallForm />
          </Card>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Card sx={{ p: 1 }} variant="outlined">
            <Suspense fallback={<Loading />}>
              <Orderbook />
            </Suspense>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
