import { Box, Button, Container, Typography, Fade, Grid } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

interface HeroProps {
  loaded: boolean;
  prefersDarkMode: boolean;
  mousePosition: { x: number; y: number };
}

const Hero = ({ loaded, prefersDarkMode, mousePosition }: HeroProps) => {
  return (
    <Box
      sx={{
        minHeight: { xs: "calc(100vh - 60px)", md: "100vh" },
        position: "relative",
        display: "flex",
        alignItems: "center",
        pt: { xs: 8, md: 10 },
        pb: { xs: 4, md: 0 },
        background: prefersDarkMode
          ? `linear-gradient(135deg, 
              rgba(0, 0, 0, 0.7) 0%, 
              rgba(25, 25, 112, 0.6) 50%, 
              rgba(0, 0, 0, 0.8) 100%)`
          : `linear-gradient(135deg, 
              rgba(25, 25, 112, 0.7) 0%, 
              rgba(30, 144, 255, 0.5) 50%, 
              rgba(25, 25, 112, 0.8) 100%)`,
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
          opacity: 0.4,
          zIndex: -2,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 215, 0, 0.15) 0%, 
              transparent 40%)
          `,
          transition: "background 0.8s ease",
          zIndex: -1,
        },
      }}
    >
      {/* Mountain Silhouette Layers */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: "20%", md: "30%" },
          background: `linear-gradient(to top, 
            ${prefersDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(25, 25, 112, 0.8)"} 0%, 
            transparent 100%)`,
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
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          zIndex: -1,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 10 }}>
        <Grid
          container
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          direction={{ xs: "column-reverse", lg: "row" }}
        >
          {/* Left Side - Main Content */}
          <Grid item xs={12} lg={7}>
            <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>
              {/* Logo */}
              <Fade in={loaded} timeout={1000}>
                <Box
                  sx={{
                    mb: { xs: 2, md: 4 },
                    "& img": {
                      maxHeight: { xs: "60px", md: "120px" },
                      maxWidth: "100%",
                      filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        filter: "drop-shadow(0 15px 40px rgba(255,215,0,0.3))",
                      },
                    },
                  }}
                >
                  {prefersDarkMode ? (
                    <img src="/kogen-logo-dark.png" alt="Kogen Markets" />
                  ) : (
                    <img src="/kogen-logo-white.png" alt="Kogen Markets" />
                  )}
                </Box>
              </Fade>

              {/* Main Heading */}
              <Fade in={loaded} timeout={1200}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: {
                      xs: "2.5rem",
                      sm: "3rem",
                      md: "4rem",
                      lg: "5rem",
                    },
                    fontWeight: 800,
                    mb: { xs: 2, md: 3 },
                    lineHeight: 1.1,
                    background: prefersDarkMode
                      ? "linear-gradient(45deg, #FFD700, #FFA500, #FF6347)"
                      : "linear-gradient(45deg, #1976d2, #42a5f5, #64b5f6)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 5px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  Welcome to
                  <br />
                  Kogen Markets
                </Typography>
              </Fade>

              {/* Subtitle */}
              <Fade in={loaded} timeout={1400}>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.6rem" },
                    mb: { xs: 3, md: 4 },
                    opacity: 0.95,
                    lineHeight: 1.5,
                    color: prefersDarkMode ? "#f5f5f5" : "#fff",
                    fontWeight: 400,
                    maxWidth: "600px",
                    mx: { xs: "auto", lg: 0 },
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  Reach the peak of decentralized options trading. Built on
                  blockchain foundations as solid as mountain bedrock.
                </Typography>
              </Fade>

              {/* CTA Button */}
              <Fade in={loaded} timeout={1600}>
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  {" "}
                  {/* Responsive margin */}
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
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 20px 45px rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  >
                    Start Trading Now
                  </Button>
                </Box>
              </Fade>

              {/* Key Features */}
              <Fade in={loaded} timeout={1800}>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 2, md: 3 },
                    justifyContent: { xs: "center", lg: "flex-start" },
                    flexWrap: "wrap",
                  }}
                >
                  {["Solid Foundation", "Peak Performance", "Clear Vision"].map(
                    (feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: { xs: 2, md: 3 },
                          py: { xs: 1, md: 1.5 },
                          borderRadius: "25px",
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(15px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          transition: "all 0.3s ease",
                          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            background: "rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#fff",
                            fontSize: { xs: "0.8rem", md: "1rem" },
                          }}
                        >
                          {" "}
                          {feature}
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </Fade>
            </Box>
          </Grid>
          {/* Right Side - Mountain Summit Success Images */}
          <Grid item xs={12} lg={5}>
            <Fade in={loaded} timeout={2000}>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: "250px", sm: "350px", md: "500px" },
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: { xs: 4, lg: 0 },
                }}
              >
                {/* Main Summit Success Image */}
                <Box
                  sx={{
                    width: { xs: "200px", sm: "250px", md: "280px" },
                    height: { xs: "200px", sm: "250px", md: "280px" },
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    background:
                      "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(30, 144, 255, 0.2))",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: "-10px",
                      right: "-10px",
                      bottom: "-10px",
                      borderRadius: "25px",
                      background: `linear-gradient(45deg, 
                        rgba(255, 215, 0, 0.3), 
                        rgba(30, 144, 255, 0.3))`,
                      animation: "successGlow 3s ease-in-out infinite",
                      zIndex: -1,
                      "@keyframes successGlow": {
                        "0%, 100%": {
                          opacity: 0.5,
                          transform: "scale(1)",
                        },
                        "50%": {
                          transform: "scale(1.02)",
                          opacity: 0.8,
                        },
                      },
                    },
                  }}
                >
                  <img
                    src="/images/mountain-summit-victory.jpg"
                    alt="People celebrating at mountain summit"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "17px",
                    }}
                  />

                  {/* Success Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      p: { xs: 1, md: 2 },
                      color: "white",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        textAlign: "center",
                        fontSize: { xs: "0.9rem", md: "1.25rem" },
                      }}
                    >
                      Summit Achieved!
                    </Typography>
                  </Box>
                </Box>

                {/* Smaller Success Images */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: "-2%", md: "10%" },
                    right: { xs: "-5%", md: "5%" },
                    width: { xs: "60px", md: "80px" },
                    height: { xs: "60px", md: "80px" },
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    animation: "float1 4s ease-in-out infinite",
                    "@keyframes float1": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                >
                  <img
                    src="/images/victory-pose-mountain.jpg"
                    alt="Victory pose on mountain"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: "-5%", md: "15%" },
                    right: { xs: "-5%", md: "8%" },
                    width: { xs: "50px", md: "70px" },
                    height: { xs: "50px", md: "70px" },
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    animation: "float2 5s ease-in-out infinite",
                    "@keyframes float2": {
                      "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                      "50%": { transform: "translateY(-8px) rotate(5deg)" },
                    },
                  }}
                >
                  <img
                    src="/images/peak-celebration.jpg"
                    alt="Joyful moment at peak"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: "60%", md: "50%" },
                    left: { xs: "5%", md: "20%" },
                    width: { xs: "40px", md: "60px" },
                    height: { xs: "40px", md: "60px" },
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    animation: "float3 6s ease-in-out infinite",
                    "@keyframes float3": {
                      "0%, 100%": { transform: "translateX(0px)" },
                      "50%": { transform: "translateX(-5px)" },
                    },
                  }}
                >
                  <img
                    src="/images/mountain-success.jpg"
                    alt="Success celebration"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Achievement Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: "15%", md: "20%" },
                    left: { xs: "5%", md: "10%" },
                    width: { xs: "40px", md: "50px" },
                    height: { xs: "40px", md: "50px" },
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 5px 15px rgba(255, 215, 0, 0.4)",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.1)" },
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}
                  >
                    🏆
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
