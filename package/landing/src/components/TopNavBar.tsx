import {
  useTheme,
  Button,
  Container,
  Toolbar,
  Box,
  AppBar,
} from "@mui/material";

const links = [
  {
    name: "About Kogen Markets",
    url: "https://medium.com/@kogen.markets",
    target: "_blank",
  },
];

function TopNavBar() {
  const theme = useTheme();
  const buttonTextColor = theme.palette.mode == "light" ? "#000000" : "#FFFFFF";
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex" }} />
          <Box sx={{ display: "flex" }}>
            {links.map((link) => (
              <Button
                key={link.name}
                href={link.url}
                target={link.target}
                sx={{ my: 2, color: buttonTextColor, display: "block" }}
              >
                {link.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TopNavBar;
