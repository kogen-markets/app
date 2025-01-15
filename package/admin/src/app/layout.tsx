import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "@/contexts/authContext";
import { SnackbarProvider } from "@/contexts/snackbarContext";
import { ShowWrapper } from "@/components/LayoutWrapper";
import { theme } from "@/libs/mui";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#f3f7fa" }}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <SnackbarProvider>
              <ShowWrapper>{children}</ShowWrapper>
            </SnackbarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
