import { Button, ButtonGroup } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import { darkModeState } from "../state/kogen";
import { useRecoilState } from "recoil";

export default function ThemeSelector() {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  return (
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      <Button
        onClick={() => setDarkMode("light")}
        variant={darkMode === "light" ? "contained" : "outlined"}
        disableElevation
      >
        <LightModeIcon />
      </Button>
      <Button
        onClick={() => setDarkMode("auto")}
        variant={darkMode === "auto" ? "contained" : "outlined"}
        disableElevation
      >
        <BrightnessAutoIcon />
      </Button>
      <Button
        onClick={() => setDarkMode("dark")}
        variant={darkMode === "dark" ? "contained" : "outlined"}
        disableElevation
      >
        <DarkModeIcon />
      </Button>
    </ButtonGroup>
  );
}
