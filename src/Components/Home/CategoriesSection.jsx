import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useShoppingContext } from '../Context/ShoppingContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

function CategoriesSection() {
  const {
    courses,
    categories,
    isLoading
  } = useShoppingContext();

  const [courseCounts, setCourseCounts] = useState({});

  useEffect(() => {
    if (courses && courses.length > 0) {
      const counts = {};

      courses.forEach(course => {
        const catId = course.categoryId;
        if (catId) {
          counts[catId] = (counts[catId] || 0) + 1;
        }
      });

      console.log('Course counts by category:', counts);
      setCourseCounts(counts);
    }
  }, [courses]);

  const sortedCategories = [...categories]
    .filter(cat => (courseCounts[cat.id] || 0) > 0)
    .sort((a, b) => {
      const countA = courseCounts[a.id] || 0;
      const countB = courseCounts[b.id] || 0;
      return countB - countA;
    })
    .slice(0, 8);

  useEffect(() => {
    console.log('Categories:', categories.length);
    console.log('Courses:', courses.length);
    console.log('Course counts:', courseCounts);
    console.log('Sorted categories:', sortedCategories.length);
  }, [categories, courses, courseCounts, sortedCategories]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8">Top Categories</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sortedCategories.length > 0 ? (
              sortedCategories.map((cat) => (
                <motion.div
                  key={cat.id}
                  className="p-6 border rounded-lg text-center shadow-lg transition cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                  onClick={() => {
                    window.location.href = `/courses?category=${cat.id}`;
                  }}
                >
                  <img
                    src={cat.imageUrl || '/images/placeholder-category.png'}
                    alt={cat.name}
                    className="w-16 h-16 mx-auto mb-4 object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${cat.name?.charAt(0) || 'C'}&background=3b82f6&color=fff&size=64`;
                    }}
                  />
                  <h3 className="font-semibold">{cat.name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">
                    {courseCounts[cat.id] || 0} Courses
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500">
                {categories.length === 0 ? 'Loading categories...' : 'No categories with courses available.'}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;