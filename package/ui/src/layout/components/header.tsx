import { Box, Grid, Typography, alpha } from "@mui/material";
import { lazy, Suspense } from "react";
import { Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import Loading from "../../components/loading";

const KeplrButton = lazy(() => import("../../components/keplr-button"));

export default function Header() {
  return (
    <Box
      sx={{
        p: 1,
      }}
    >
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid
          item
          xs={12}
          sm={"auto"}
          sx={{ textAlign: { xs: "center" }, mb: { xs: 3, sm: 0 } }}
        ></Grid>
        <Grid
          item
          xs={12}
          sm={"auto"}
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          <Suspense fallback={<Loading />}>
            <KeplrButton />
          </Suspense>
        </Grid>
      </Grid>
    </Box>
  );
}
