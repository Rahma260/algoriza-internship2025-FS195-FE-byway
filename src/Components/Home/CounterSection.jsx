import { motion } from "framer-motion";
import Counter from "./Counter";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

function CountersSection() {
  const stats = [
    { num: 250, label: "Courses by our best mentors" },
    { num: 1000, label: "Happy Students" },
    { num: 15, label: "Years of Experience" },
    { num: 2400, label: "Successful Graduates" },
  ];

  return (
    <section className="bg-gray-100 text-black py-16">
      <motion.div
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stats.map((item, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="flex items-baseline justify-center gap-1">
              <Counter from={0} to={item.num} duration={2} />
              <span className="text-4xl font-bold text-gray-900">+</span>
            </div>
            <p className="text-sm mt-2">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default CountersSection;
