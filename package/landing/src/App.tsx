import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { darkTheme, lightTheme } from "@kogen/kogen-ui/src/lib/theme";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          sx={{
            my: 5,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            "& img": {
              height: "130px",
            },
          }}
        >
          {prefersDarkMode ? (
            <img src="/kogen-logo-dark.png" />
          ) : (
            <img src="/kogen-logo-white.png" />
          )}
        </Box>
        <Alert severity="warning" variant="outlined">
          Please note that Kogen is currently in active development. While we
          strive to offer you the best user experience possible, it's important
          to be aware that there may be occasional glitches or limitations as we
          continue to refine and enhance the platform.
        </Alert>
        <Card sx={{ p: 3, mt: 4 }} variant="outlined" color="secondary">
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to Kogen, the ultimate decentralized options trading tool
            designed to revolutionize the way you trade call options. Built on
            the principles of blockchain technology and powered by smart
            contracts, Kogen provides a secure, transparent, and decentralized
            platform for biding and asking call options. With Kogen, you have
            the freedom to engage in peer-to-peer options trading without the
            need for intermediaries or centralized authorities.
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }} component="div">
            Our innovative platform empowers you to participate in trustless and
            efficient bidding and asking processes, ensuring fairness and equal
            opportunities for all participants. Whether you're a seasoned
            options trader or new to the world of call options, Kogen offers a
            user-friendly interface and robust features to enhance your trading
            experience.
          </Typography>
          <Typography variant="body1" sx={{ my: 2 }} component="div">
            Experience the benefits of decentralized options trading with Kogen,
            where you can unleash your trading potential, take control of your
            investments, and navigate the exciting realm of call options with
            ease. Join us today and embark on a journey that reshapes the way
            you approach options trading.
          </Typography>

          <Box sx={{ textAlign: "center", mt: 6, mb: 3 }}>
            <Button
              variant="contained"
              disableElevation
              color="secondary"
              size="large"
              href={import.meta.env.VITE_FRONTEND_URL}
            >
              Go to the APP
            </Button>
          </Box>
        </Card>

        <Box sx={{ mt: 3, mb: 10, textAlign: "center" }}>
          <Typography variant="caption">
            <Link
              color={"secondary"}
              href="https://beta.howl.social/kogen"
              target={"_blank"}
              rel="noreferrer"
            >
              howl
            </Link>{" "}
            |{" "}
            {/* <Link
              color={"secondary"}
              href="https://twitter.com/howlpack"
              target={"_blank"}
              rel="noreferrer"
            >
              twitter
            </Link>{" "}
            |{" "} */}
            <Link
              color={"secondary"}
              href="https://github.com/kogen-markets/"
              target={"_blank"}
              rel="noreferrer"
            >
              github
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
