import React, { useState, useEffect } from 'react';
import { Star, Users, Play } from 'lucide-react';
import { useInstructorContext } from '../Context/InstructorContext';

const InstructorDetails = ({ instructor, fullBio = false, instructorId: courseInstructorId }) => {
  const { fetchInstructorStats, fetchInstructorById } = useInstructorContext();

  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(instructor);

  const getInstructorId = (inst, courseInstId) => {
    if (inst) {
      const instructorId = inst.id ?? inst.Id ?? inst.instructorId ?? inst.InstructorId ?? inst._id ?? null;
      if (instructorId) return instructorId;
    }

    return courseInstId;
  };

  useEffect(() => {
    const loadInstructorData = async () => {
      setError(null);

      const id = getInstructorId(instructor, courseInstructorId);
      console.debug('InstructorDetails: instructor prop:', instructor);
      console.debug('InstructorDetails: course instructorId prop:', courseInstructorId);
      console.debug('InstructorDetails: resolved instructor id:', id);

      if (!id) {
        setLoading(false);
        setStats({ courses: 0, students: 0, reviews: 0 });
        return;
      }

      setLoading(true);
      try {
        if (fullBio || !instructor?.description) {
          console.debug('Fetching full instructor details for ID:', id);
          const fullInstructor = await fetchInstructorById(id);
          if (fullInstructor) {
            setInstructorDetails(fullInstructor);
            console.debug('Full instructor details loaded:', fullInstructor);
          }
        } else {
          setInstructorDetails(instructor);
        }

        const instructorStats = await fetchInstructorStats(id);
        setStats({
          courses: instructorStats?.courses ?? 0,
          students: instructorStats?.students ?? 0,
          reviews: instructorStats?.reviews ?? 0
        });
        setError(null);
      } catch (err) {
        console.error('InstructorDetails: error fetching data', err);
        setError('Failed to load instructor information');
        setStats({ courses: 0, students: 0, reviews: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadInstructorData();
  }, [instructor, courseInstructorId, fullBio, fetchInstructorStats, fetchInstructorById]);

  if (!instructorDetails) return null;

  const getJobTitle = () => {
    if (instructorDetails.jobTitle !== undefined) {
      const jobTitles = {
        0: 'Fullstack Developer',
        1: 'Backend Developer',
        2: 'Frontend Developer',
        3: 'UX/UI Designer'
      };
      return typeof instructorDetails.jobTitle === 'number'
        ? jobTitles[instructorDetails.jobTitle] || 'Unknown'
        : instructorDetails.jobTitle;
    }
    return instructorDetails.title || 'Instructor';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Instructor
      </h3>

      <div className="flex items-start gap-4">
        <img
          src={instructorDetails.imageUrl}
          alt={instructorDetails.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorDetails.name)}&background=4c51bf&color=fff&size=128`;
          }}
        />

        <div className="flex-1">
          <h4 className="text-lg font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
            {instructorDetails.name}
          </h4>
          <p className="text-sm text-gray-600 mb-3">{getJobTitle()}</p>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Star className="w-4 h-4 text-gray-500" />
              <span>{(instructorDetails.rate || instructorDetails.rating || 0).toFixed(1)} Reviews</span>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4 animate-pulse" />
                <span>Loading students...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <Users className="w-4 h-4" />
                <span>{error}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{stats.students.toLocaleString()} Students</span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Play className="w-4 h-4 animate-pulse" />
                <span>Loading courses...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <Play className="w-4 h-4" />
                <span>{error}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Play className="w-4 h-4 text-gray-500" />
                <span>{stats.courses} Courses</span>
              </div>
            )}
          </div>

          {(fullBio || instructorDetails.description) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">About the Instructor</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {instructorDetails.description || 'No description available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;