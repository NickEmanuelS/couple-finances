import { motion } from "framer-motion";

export const Card = ({ children, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    style={{ background: "white", borderRadius: 16, padding: 16, ...style }}
  >
    {children}
  </motion.div>
);
