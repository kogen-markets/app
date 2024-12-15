import { Box, Grid, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Fragment } from "react/jsx-runtime";

const links = [
  {
    logo: <GitHubIcon />,
    text: "Check out our Github",
    url: "https://github.com/kogen-markets/",
  },
  {
    logo: <XIcon />,
    text: "Follow us on X",
    url: "https://x.com/KogenMarkets",
  },
  {
    logo: <TelegramIcon />,
    text: "Follow us on Telegram",
    url: "https://t.me/+6OWwq2YaPKFjYTY9",
  },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "transparent",
        padding: "20px",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {links.map((link, index) => (
          <Fragment key={index}>
            <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Link
                href={link.url}
                title={link.text}
                target="_blank"
                rel="noreferrer"
                sx={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": { opacity: 0.8 },
                }}
              >
                {link.logo}
              </Link>
            </Grid>

            {/* Delimiter (Hide after last item) */}
            {index < links.length - 1 && (
              <Grid item>
                <Box
                  sx={{
                    height: "24px",
                    width: "1px",
                    backgroundColor: "#ddd",
                    mx: 2,
                  }}
                />
              </Grid>
            )}
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default Footer;
