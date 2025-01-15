"use client";
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, AlertColor, Slide, SlideProps } from "@mui/material";

interface ShowSnackbarParams {
  newMessage: string;
  newSeverity: AlertColor;
}

type ShowSnackbarType = (params: ShowSnackbarParams) => void;

type SnackbarContextType = ShowSnackbarType;

const defaultSnackbarContext: SnackbarContextType = () => {};

const SnackbarContext = createContext<SnackbarContextType>(
  defaultSnackbarContext
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === defaultSnackbarContext) {
    throw new Error("useSnackbar must be used within an SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  const showSnackbar = ({
    newMessage,
    newSeverity = "info",
  }: ShowSnackbarParams) => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const hideSnackbar = () => {
    setOpen(false);
  };

  const Transition = (props: SlideProps) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Transition}
      >
        <Alert severity={severity} onClose={hideSnackbar}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
