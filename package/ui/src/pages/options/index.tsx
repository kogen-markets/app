import { Card, Grid, Typography } from "@mui/material";

import { Fragment } from "react";
import CallForm from "./components/call-form";

export default function Options() {
  return (
    <Fragment>
      <Typography variant="h4" component="h2">
        Call Options
      </Typography>

      <Grid container direction="row" justifyContent="left" alignItems="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3, mt: { xs: 1, lg: 4 } }} variant="outlined">
            <CallForm />
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
