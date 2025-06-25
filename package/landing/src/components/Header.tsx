import { Box, Container, Button, Fade } from "@mui/material";

interface HeaderProps {
  loaded: boolean;
  prefersDarkMode: boolean;
}

const Header = ({ loaded, prefersDarkMode }: HeaderProps) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        background: "rgba(255, 255, 255, 0.05)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        px: { xs: 2, md: 0 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 1.5, md: 2 },
          }}
        >
          <Fade in={loaded} timeout={800}>
            <Box
              sx={{
                "& img": {
                  height: { xs: "35px", md: "40px" },
                  filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.3))",
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

          <Fade in={loaded} timeout={1000}>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, md: 2 },
                alignItems: "center",
              }}
            >
              {" "}
              {/* Responsive gap */}
              <Button
                href="https://medium.com/@kogen.markets"
                target="_blank"
                sx={{
                  color: prefersDarkMode ? "#fff" : "#000",
                  fontWeight: 600,
                  px: { xs: 2, md: 3 },
                  py: { xs: 0.8, md: 1 },
                  borderRadius: "25px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                  },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                }}
              >
                About
              </Button>
              <Button
                variant="contained"
                href={import.meta.env.VITE_FRONTEND_URL}
                sx={{
                  background: prefersDarkMode
                    ? "linear-gradient(45deg, #FFD700, #FFA500)"
                    : "linear-gradient(45deg, #1976d2, #42a5f5)",
                  borderRadius: "25px",
                  px: { xs: 2, md: 3 },
                  py: { xs: 0.8, md: 1 },
                  fontWeight: 600,
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
                  },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                }}
              >
                Launch App
              </Button>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
