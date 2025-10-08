import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function CallToActionTwo() {
  return (
    <section className="py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-6">
            Checkout Courses & Launch Your Career
          </h2>
          <p className="mb-4 text-md text-gray-700">
            Learners around the world are launching new careers, advancing in
            their fields, and enriching their lives.
          </p>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg font-semibold border-2 border-black bg-black text-white transition hover:text-black hover:bg-white"
          >
            <Link to="/courses">
              Checkout Courses →
            </Link>
          </motion.button>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full h-92 rounded-3xl overflow-hidden">
            <img
              src="/images/student.png"
              alt="Student"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CallToActionTwo;
