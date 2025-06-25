import { Box, Container, Typography, Button } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

interface CTAProps {
  prefersDarkMode: boolean;
}

const CTA = ({ prefersDarkMode }: CTAProps) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        background: prefersDarkMode
          ? `linear-gradient(135deg, 
              rgba(0, 0, 0, 0.9) 0%, 
              rgba(25, 25, 112, 0.7) 50%, 
              rgba(0, 0, 0, 0.9) 100%)`
          : `linear-gradient(135deg, 
              rgba(25, 25, 112, 0.9) 0%, 
              rgba(30, 144, 255, 0.7) 50%, 
              rgba(25, 25, 112, 0.9) 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/kogen-background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
          zIndex: -2,
        },
      }}
    >
      {/* Mountain Range Silhouette */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: "30%", md: "40%" },
          background: `
            linear-gradient(to top, 
              ${prefersDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(25, 25, 112, 0.8)"} 0%, 
              transparent 100%),
            linear-gradient(135deg, 
              transparent 0%, 
              rgba(255, 215, 0, 0.1) 50%, 
              transparent 100%)
          `,
          zIndex: -1,
        }}
      />

      {/* Subtle Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.02) 20px,
              rgba(255, 255, 255, 0.02) 21px
            )
          `,
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            mb: { xs: 3, md: 4 },
            background: prefersDarkMode
              ? "linear-gradient(45deg, #FFD700, #FFA500)"
              : "linear-gradient(45deg, #1976d2, #42a5f5)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
            textShadow: "0 5px 15px rgba(0,0,0,0.3)",
          }}
        >
          Ready to Reach the Peak?
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: { xs: 4, md: 6 },
            opacity: 0.95,
            lineHeight: 1.6,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
            maxWidth: "700px",
            mx: "auto",
            color: prefersDarkMode ? "#f5f5f5" : "#fff",
            fontWeight: 400,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          Join us on the ascent to revolutionary decentralized trading. Like
          climbing a mountain, every step forward brings you closer to the
          summit of financial freedom.
        </Typography>

        <Button
          variant="contained"
          size="large"
          href={import.meta.env.VITE_FRONTEND_URL}
          endIcon={<LaunchIcon />}
          sx={{
            fontSize: { xs: "1rem", md: "1.3rem" },
            fontWeight: 600,
            px: { xs: 4, md: 8 },
            py: { xs: 1.5, md: 3 },
            borderRadius: "50px",
            background: prefersDarkMode
              ? "linear-gradient(45deg, #FFD700, #FFA500)"
              : "linear-gradient(45deg, #1976d2, #42a5f5)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          Begin Your Journey
        </Button>
      </Container>
    </Box>
  );
};

export default CTA;
