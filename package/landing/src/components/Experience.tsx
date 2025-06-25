import { Box, Container, Typography, Grid, Button } from "@mui/material";

interface ExperienceProps {
  prefersDarkMode: boolean;
}

const Experience = ({ prefersDarkMode }: ExperienceProps) => {
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
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
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
            Your Trading Experience
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.8,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
              color: prefersDarkMode ? "#e0e0e0" : "#333",
              fontWeight: 400,
            }}
          >
            Whether you are a seasoned options trader or new to the world of
            derivatives, Kogen Markets offers a user-friendly interface and
            robust features to enhance your trading experience.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {" "}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, md: 3 },
                  background: prefersDarkMode
                    ? "linear-gradient(45deg, #FFA500, #FFD700)"
                    : "linear-gradient(45deg, #42a5f5, #1976d2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                For Experienced Traders
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.8,
                  lineHeight: 1.7,
                  mb: { xs: 3, md: 4 },
                  color: prefersDarkMode ? "#e0e0e0" : "#333",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Leverage our decentralized limit order books for precise control
                over your trades. Access deep liquidity and execute complex
                options strategies with confidence. Our platform is built to
                meet the demands of professional traders.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: prefersDarkMode ? "#FFD700" : "#1976d2",
                  color: prefersDarkMode ? "#FFD700" : "#1976d2",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: prefersDarkMode
                      ? "rgba(255, 215, 0, 0.1)"
                      : "rgba(25, 25, 112, 0.1)",
                    transform: "translateY(-2px)",
                  },
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Explore Advanced Features
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 2, md: 3 },
                  background: prefersDarkMode
                    ? "linear-gradient(45deg, #FFA500, #FFD700)"
                    : "linear-gradient(45deg, #42a5f5, #1976d2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                For New Traders
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.8,
                  lineHeight: 1.7,
                  mb: { xs: 3, md: 4 },
                  color: prefersDarkMode ? "#e0e0e0" : "#333",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Our intuitive interface and comprehensive guides make options
                trading accessible. Start your journey with confidence, learn at
                your own pace, and explore the exciting world of decentralized
                finance.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: prefersDarkMode ? "#FFD700" : "#1976d2",
                  color: prefersDarkMode ? "#FFD700" : "#1976d2",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: prefersDarkMode
                      ? "rgba(255, 215, 0, 0.1)"
                      : "rgba(25, 25, 112, 0.1)",
                    transform: "translateY(-2px)",
                  },
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Get Started with Guides
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Experience;
