import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 w-72">
          What Our Customer Say About Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-2xl shadow-gray-400/50 p-6 text-left border border-gray-300"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h1 className="text-blue-500 text-4xl mb-2">
                <FaQuoteLeft />
              </h1>
              <p className="text-gray-800 mb-4 text-md">
                “Byway's tech courses are top-notch! As someone who's always
                looking to stay ahead in the rapidly evolving tech world, I
                appreciate the up-to-date content and engaging multimedia.”
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/images/review.jpg"
                  alt="Jane Doe"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">Jane Doe</h4>
                  <p className="text-xs text-gray-500">Designer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
