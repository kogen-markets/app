"use client";

import { Box, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { darkTheme, lightTheme } from "@kogen/kogen-ui/src/lib/theme";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Experience from "./components/Experience";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ overflowX: "hidden" }}>
        {" "}
        {/* Prevent horizontal scroll on small screens */}
        {/* Fixed Header */}
        <Header loaded={loaded} prefersDarkMode={prefersDarkMode} />
        {/* Hero Section - Main landing with mountain theme */}
        <Hero
          loaded={loaded}
          prefersDarkMode={prefersDarkMode}
          mousePosition={mousePosition}
        />
        {/* About Section - Platform description and development notice */}
        <About prefersDarkMode={prefersDarkMode} />
        {/* Stats Section - Platform metrics */}
        <Stats loaded={loaded} prefersDarkMode={prefersDarkMode} />
        {/* Features Section - Key platform features */}
        <Features prefersDarkMode={prefersDarkMode} />
        {/* Experience Section - User-focused content */}
        <Experience prefersDarkMode={prefersDarkMode} />
        {/* CTA Section - Final call to action */}
        <CTA prefersDarkMode={prefersDarkMode} />
        {/* Footer - Social links and branding */}
        <Footer prefersDarkMode={prefersDarkMode} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
