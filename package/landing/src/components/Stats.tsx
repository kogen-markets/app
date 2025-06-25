import { Box, Container, Typography, Grid, Fade } from "@mui/material";

interface StatsProps {
  loaded: boolean;
  prefersDarkMode: boolean;
}

const Stats = ({ loaded, prefersDarkMode }: StatsProps) => {
  const stats = [
    { value: "$50M+", label: "Total Volume Traded" },
    { value: "10K+", label: "Active Traders" },
    { value: "99.9%", label: "Platform Uptime" },
    { value: "5+", label: "Supported Chains" },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: prefersDarkMode
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Fade in={loaded} timeout={1600}>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {" "}
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: { xs: 2, md: 3 },
                    borderRadius: "15px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      background: "rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: { xs: 0.5, md: 1 },
                      background: prefersDarkMode
                        ? "linear-gradient(45deg, #FFD700, #FFA500)"
                        : "linear-gradient(45deg, #1976d2, #42a5f5)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.5rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.8,
                      fontWeight: 500,
                      color: prefersDarkMode ? "#e0e0e0" : "#333",
                      fontSize: { xs: "0.8rem", md: "1rem" },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Stats;
