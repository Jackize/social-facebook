import { List, styled } from "@mui/material";

export const ListStyle = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  maxHeight: "211px",
  overflowY: "scroll",
  borderRadius: "20px",
}));
