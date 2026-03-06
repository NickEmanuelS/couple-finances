import { Card as MuiCard, CardContent } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion.create(MuiCard);

export const Card = ({ children, style = {}, sx = {} }) => (
  <MotionCard
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    style={style}
    sx={sx}
  >
    <CardContent sx={{ "&:last-child": { pb: 2 } }}>
      {children}
    </CardContent>
  </MotionCard>
);
