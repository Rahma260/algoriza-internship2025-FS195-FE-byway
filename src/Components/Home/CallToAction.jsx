import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full h-full rounded-3xl overflow-hidden">
            <img
              src="/images/instructor2.png"
              alt="Instructor"
              className="object-cover h-full w-full"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Become an Instructor</h2>
          <p className="text-gray-700 text-md mb-6">
            Instructors from around the world teach millions of students on
            Byway. We provide the tools and skills to teach what you love.
          </p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg font-semibold border-2 border-black bg-black text-white transition hover:text-black hover:bg-white"
          >
            <Link to="/register">
              Start Your Instructor Journey →
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default CallToAction;
