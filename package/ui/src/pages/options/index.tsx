import { Card, Grid, Typography } from "@mui/material";

import { Fragment } from "react";

export default function Options() {
  return (
    <Fragment>
      <Typography variant="h4" component="h2">
        Options
      </Typography>

      <Grid container direction="row" justifyContent="left" alignItems="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3, mt: 4 }} variant="outlined">
            <Typography variant="body1" sx={{ mb: 2 }}>
              Welcome to Kogen, the ultimate decentralized options trading tool
              designed to revolutionize the way you trade call options. Built on
              the principles of blockchain technology and powered by smart
              contracts, Kogen provides a secure, transparent, and decentralized
              platform for biding and asking call options. With Kogen, you have
              the freedom to engage in peer-to-peer options trading without the
              need for intermediaries or centralized authorities.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
