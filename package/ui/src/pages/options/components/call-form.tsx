import { Button, ButtonGroup, Divider, Typography } from "@mui/material";
import { Fragment } from "react";

export default function CallForm() {
  return (
    <Fragment>
      <Typography variant="caption">Call type</Typography>
      <ButtonGroup variant="outlined" aria-label="call option" fullWidth>
        <Button variant="contained" disableElevation>
          ASK
        </Button>
        <Button>BID</Button>
      </ButtonGroup>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to Kogen, the ultimate decentralized options trading tool
        designed to revolutionize the way you trade call options. Built on the
        principles of blockchain technology and powered by smart contracts,
        Kogen provides a secure, transparent, and decentralized platform for
        biding and asking call options. With Kogen, you have the freedom to
        engage in peer-to-peer options trading without the need for
        intermediaries or centralized authorities.
      </Typography>
    </Fragment>
  );
}
