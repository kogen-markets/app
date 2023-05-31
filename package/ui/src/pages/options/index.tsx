import { Card, Grid, Paper, Typography } from "@mui/material";

import { Fragment, Suspense } from "react";
import CallForm from "./components/call-form";
import Orderbook from "./components/order-book";
import Loading from "../../components/loading";
import YourPosition from "./components/your-position";

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
          <Card sx={{ p: 3, height: "450px" }} variant="outlined">
            <CallForm />
          </Card>
          <Card sx={{ mt: 4, px: 3, py: 2 }} variant="outlined">
            <YourPosition />
          </Card>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Paper sx={{ p: 1, height: "450px" }} variant="outlined">
            <Suspense fallback={<Loading />}>
              <Orderbook />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
}
