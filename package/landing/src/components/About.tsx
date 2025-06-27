import { Box, Container, Typography, Alert } from "@mui/material";

interface AboutProps {
  prefersDarkMode: boolean;
}

const About = ({ prefersDarkMode }: AboutProps) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: prefersDarkMode
          ? "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(25,25,112,0.2) 50%, rgba(0,0,0,1) 100%)"
          : "linear-gradient(180deg, rgba(25,25,112,0.9) 0%, rgba(30,144,255,0.2) 50%, rgba(25,25,112,0.9) 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Development Notice */}
        <Alert
          severity="warning"
          sx={{
            mb: { xs: 4, md: 6 },
            background: prefersDarkMode
              ? "rgba(255, 215, 0, 0.1)"
              : "rgba(255, 165, 0, 0.1)",
            color: prefersDarkMode ? "#FFD700" : "#FFA500",
            borderColor: prefersDarkMode ? "#FFD700" : "#FFA500",
            border: "1px solid",
            borderRadius: "10px",
            fontSize: { xs: "0.9rem", md: "1rem" },
            textAlign: "center",
            "& .MuiAlert-icon": {
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            },
          }}
        >
          Please note that Kogen is currently in active development. While we
          strive to offer you the best user experience possible, it's important
          to be aware that there may be occasional glitches or limitations as we
          continue to refine and enhance the platform.
        </Alert>

        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          {" "}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              mb: { xs: 2, md: 3 },
              background: prefersDarkMode
                ? "linear-gradient(45deg, #FFD700, #FFA500)"
                : "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            About Kogen Markets
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.8,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
              color: prefersDarkMode ? "#e0e0e0" : "#333",
              fontWeight: 400,
            }}
          >
            Welcome to Kogen Markets, the ultimate decentralized options trading
            platform designed to revolutionize the way you trade call and put
            options. Built on the principles of blockchain technology and
            powered by smart contracts, Kogen Markets provides a secure,
            transparent, and decentralized platform for trading vanilla options.
            With Kogen Markets, your orders go on-chain on our decentralized
            limit order books, giving you the same access as any sophisticated
            trader.
            <br />
            <br />
            Our innovative platform empowers you to participate in trustless and
            efficient bidding and offering orders, ensuring fairness and equal
            opportunities for all participants. Whether you are a seasoned
            options trader or new to the world of derivatives, Kogen Markets
            offers a user-friendly interface and robust features to enhance your
            trading experience.
            <br />
            Experience the benefits of decentralized options trading with Kogen
            Markets, where you can unleash your trading potential, take control
            of your investments, and navigate the exciting realm of call and put
            options with ease. Join us today and embark on a journey that
            reshapes the way you approach options trading.
          </Typography>
        </Box>

        {/* Additional content or feature cards can go here */}
      </Container>
    </Box>
  );
};

export default About;
