import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

function Counter({ from, to, duration = 2 }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "linear" });
    return controls.stop;
  }, [count, to, duration]);

  return (
    <motion.span className="text-4xl font-bold text-gray-900">
      {rounded}
    </motion.span>
  );
}

export default Counter;
