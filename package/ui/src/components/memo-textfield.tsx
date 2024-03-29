import React, { memo, useCallback } from "react";
import { TextField } from "@mui/material";

export const MemoTextField = memo<typeof TextField>(
  (opts: Parameters<typeof TextField>[0]) => {
    const onWheel = useCallback((e: any) => e.target.blur(), []);

    return <TextField {...opts} onWheel={onWheel} />;
  },
);

MemoTextField.displayName = "MemoTextField";
