import React from 'react';
import InstructorDetails from './InstructorDetails';
import CourseContentList from './CourseContentList';
import LearnerReviews from './LearnerReviews';

const TabContent = ({ activeTab, courseData, instructor, reviews }) => {
  switch (activeTab) {
    case 'Description':
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {courseData.description}
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Certification</h3>
            <p className="text-gray-600 leading-relaxed">
              {courseData.certification}
            </p>
          </div>
        </div>
      );

    case 'Instructor':
      return (
        <InstructorDetails
          instructor={instructor}
          instructorId={courseData.instructorId}
          fullBio={true}
        />
      );

    case 'Content':
      return <CourseContentList content={courseData.content} />;

    case 'Reviews':
      return <LearnerReviews reviews={reviews} fullDetails={true} />;

    default:
      return null;
  }
};

export default TabContent;