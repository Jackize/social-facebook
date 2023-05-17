import React from "react";
import { CircularProgress } from "@mui/material";

const SuspenseLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px", // Set the desired height
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default SuspenseLoading;
