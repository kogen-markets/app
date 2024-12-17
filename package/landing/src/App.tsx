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
import Footer from "./components/Footer";
import Disclaimer from "./components/Disclaimer";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          opacity: 0.5,
          zIndex: -1,
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/kogen-background.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0",
          backgroundSize: "cover",
        }}
      ></Box>
      <Container maxWidth="md">
        <Box
          sx={{
            my: 5,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            "& img": {
              maxHeight: "130px",
              maxWidth: "100%",
            },
          }}
        >
          {prefersDarkMode ? (
            <img src="/kogen-logo-dark.png" />
          ) : (
            <img src="/kogen-logo-white.png" />
          )}
        </Box>
        <Disclaimer />
        <Card
          sx={{ p: 3, mt: 4, backdropFilter: "blur(5px)" }}
          variant="outlined"
          color="secondary"
        >
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
            opportunities for all participants. Whether you&apos;re a seasoned
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

        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
