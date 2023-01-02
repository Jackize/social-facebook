import { Box, styled } from "@mui/material";
export const CoverPic = styled(Box)(() => ({
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "100%",
  height: "25rem",
  borderRadius: "10px",
  marginBottom: "50px",
  position: "relative",
  objectFit: "cover",
}));

export const AvatarPic = styled(Box)(({ theme }) => ({
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: 150,
  height: 150,
  borderRadius: "50%",
  overflow: "hidden",
  [theme.breakpoints.between("sm", "lg")]: {
    width: 110,
    height: 110,
  },
  [theme.breakpoints.down("sm")]: {
    width: 80,
    height: 80,
  },
}));

export const InfoUser = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: "22%",
  bottom: "-44%",
  transform: "translate(-50%, -50%)",
  [theme.breakpoints.between("sm", "md")]: {
    left: "26%",
    bottom: "-33%",
  },
  [theme.breakpoints.down("sm")]: {
    left: "33%",
    bottom: "-26%",
  },
  [theme.breakpoints.between("md", "lg")]: {
    left: "30%",
    bottom: "-34%",
  },
}));
