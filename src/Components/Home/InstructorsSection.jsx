import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShoppingContext } from '../Context/ShoppingContext';
import { useInstructorContext } from '../Context/InstructorContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const InstructorsSection = () => {
  const { topInstructors, isLoading } = useShoppingContext();
  const { fetchInstructorStats } = useInstructorContext();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [studentCounts, setStudentCounts] = useState({});

  const getJobTitle = (jobTitle) => {
    const jobTitleNames = {
      0: 'Fullstack Developer',
      1: 'Backend Developer',
      2: 'Frontend Developer',
      3: 'UX/UI Designer'
    };
    return typeof jobTitle === 'number'
      ? jobTitleNames[jobTitle] || 'Unknown'
      : jobTitle || 'Unknown';
  };

  useEffect(() => {
    const fetchStudentCounts = async () => {
      if (topInstructors.length === 0) return;

      const promises = topInstructors.map(instructor => {
        if (instructor.id) {
          return fetchInstructorStats(instructor.id);
        }
        return Promise.resolve({ students: 0 });
      });

      try {
        const results = await Promise.all(promises);

        const countsObject = {};
        topInstructors.forEach((instructor, index) => {
          if (instructor.id) {
            countsObject[instructor.id] = results[index].students || 0;
          }
        });

        setStudentCounts(countsObject);
      } catch (err) {
        console.error("Error fetching instructor stats:", err);
      }
    };

    fetchStudentCounts();
  }, [topInstructors, fetchInstructorStats]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [topInstructors]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Top Instructors</h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-all ${canScrollLeft
                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-all ${canScrollRight
                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {topInstructors.length > 0 ? (
                topInstructors.map((instructor, index) => (
                  <motion.div
                    key={instructor.id || index}
                    className="bg-white rounded-lg shadow-md p-4 text-center flex-shrink-0 w-[200px] snap-start"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.08 }}
                  >
                    <img
                      src={instructor.imageUrl || '/images/instructor.png'}
                      alt={instructor.name || 'Instructor'}
                      className="w-full h-36 mx-auto rounded-lg mb-4 object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${instructor.name || 'I'}&background=4c51bf&color=fff&size=128`;
                      }}
                    />
                    <h3 className="font-semibold line-clamp-1">{instructor.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500">{getJobTitle(instructor.jobTitle)}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <p className="text-yellow-500 font-medium">
                          ⭐ {(instructor.rate || 0).toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {studentCounts[instructor.id] || 0} students
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="w-full text-center text-gray-500">No top instructors available.</p>
              )}
            </div>

            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 z-10"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 z-10"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default InstructorsSection;