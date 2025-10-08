import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

        <motion.div
          className="flex-1 max-w-lg text-center md:text-left"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-snug">
            Unlock Your Potential with Byway
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Welcome to Byway, where learning knows no bounds. We believe that
            education is the key to personal and professional growth, and
            we're here to guide you on your journey to success.
          </p>

          {!isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg font-semibold border-2 border-black bg-black text-white transition-all hover:text-black hover:bg-white"
            >
              Start your journey
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="flex-1 flex justify-end"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/images/herosection.png"
            alt="Student learning online"
            className="w-[500px] h-[500px] object-cover rounded-xl"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;