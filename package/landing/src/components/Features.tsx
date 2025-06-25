import { Box, Container, Typography, Grid, Card } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BarChartIcon from "@mui/icons-material/BarChart";
import PublicIcon from "@mui/icons-material/Public";

interface FeaturesProps {
  prefersDarkMode: boolean;
}

const Features = ({ prefersDarkMode }: FeaturesProps) => {
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: { xs: 30, md: 40 } }} />,
      title: "Decentralized Security",
      description:
        "Built on blockchain technology with smart contract security, ensuring your funds are protected by decentralized protocols rather than centralized entities.",
      color: "#4CAF50",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: { xs: 30, md: 40 } }} />,
      title: "Professional Trading",
      description:
        "Access sophisticated options trading tools with the same capabilities as institutional traders through our decentralized limit order books.",
      color: "#2196F3",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: { xs: 30, md: 40 } }} />,
      title: "Efficient Execution",
      description:
        "Experience fast and efficient order execution with our optimized blockchain infrastructure designed for high-performance trading.",
      color: "#FF9800",
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: { xs: 30, md: 40 } }} />,
      title: "Multi-Chain Support",
      description:
        "Trade across multiple blockchain networks seamlessly, giving you access to diverse markets and opportunities.",
      color: "#9C27B0",
    },
    {
      icon: <BarChartIcon sx={{ fontSize: { xs: 30, md: 40 } }} />,
      title: "Transparent Markets",
      description:
        "All orders and trades are recorded on-chain, providing complete transparency and equal access to market information.",
      color: "#F44336",
    },
    {
      icon: <PublicIcon sx={{ fontSize: { xs: 30, md: 40 } }} />,
      title: "Global Access",
      description:
        "Access decentralized options trading from anywhere in the world, 24/7, without geographical restrictions or intermediaries.",
      color: "#00BCD4",
    },
  ];

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
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
          {" "}
          {/* Responsive margin */}
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
            Why Choose Kogen Markets?
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
            Discover the advantages of decentralized options trading with our
            innovative platform built for the future of finance.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {" "}
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: { xs: 3, md: 4 },
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255, 255, 255, 0.08)",
                    boxShadow: `0 20px 40px ${feature.color}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      borderRadius: "12px",
                      background: `${feature.color}15`,
                      color: feature.color,
                      mr: { xs: 1.5, md: 2 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: prefersDarkMode ? "#fff" : "#000",
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.8,
                    lineHeight: 1.7,
                    color: prefersDarkMode ? "#e0e0e0" : "#333",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
