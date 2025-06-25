import { Box, Container, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";

interface FooterProps {
  prefersDarkMode: boolean;
}

const Footer = ({ prefersDarkMode }: FooterProps) => {
  const socialLinks = [
    {
      icon: <GitHubIcon />,
      url: "https://github.com/kogen-markets/",
      label: "GitHub",
    },
    { icon: <XIcon />, url: "https://x.com/KogenMarkets", label: "X" },
    {
      icon: <TelegramIcon />,
      url: "https://t.me/+6OWwq2YaPKFjYTY9",
      label: "Telegram",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        background: "rgba(0, 0, 0, 0.9)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" }, // Stack on small screens
            gap: { xs: 3, md: 4 }, // Responsive gap
          }}
        >
          <Box
            sx={{
              "& img": {
                height: { xs: "30px", md: "40px" },
                opacity: 0.8,
              },
            }}
          >
            {prefersDarkMode ? (
              <img src="/kogen-logo-dark.png" alt="Kogen Markets" />
            ) : (
              <img src="/kogen-logo-white.png" alt="Kogen Markets" />
            )}
          </Box>

          <Box sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
            {" "}
            {/* Responsive gap */}
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                href={social.url}
                target="_blank"
                sx={{
                  width: { xs: 40, md: 50 }, // Responsive size
                  height: { xs: 40, md: 50 }, // Responsive size
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            pt: { xs: 3, md: 4 },
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ opacity: 0.6, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
          >
            {" "}
            {/* Responsive font size */}© 2024 Kogen Markets. All rights
            reserved. Trading involves risk. Please trade responsibly.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
