import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

const CourseContentList = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h3>

      {content && content.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {content.map((section, index) => (
            <div key={index} className={index > 0 ? 'border-t border-gray-200' : ''}>
              <button
                className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{section.lectures} lectures</span>
                  <span>•</span>
                  <span>{formatDuration(section.duration)}</span>
                  {expandedSections.has(index) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {expandedSections.has(index) && (
                <div className="px-4 pb-4">
                  <div className="pl-4 space-y-3">
                    {section.lectureDetails && section.lectureDetails.length > 0 ? (
                      section.lectureDetails.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className="flex items-center justify-between py-2 text-sm">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{lecture.title}</span>
                          </div>
                          <span className="text-gray-500">{lecture.duration}</span>
                        </div>
                      ))
                    ) : (
                      Array.from({ length: section.lectures }, (_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 text-sm">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">Lecture {i + 1}</span>
                          </div>
                          <span className="text-gray-500">{formatDuration(Math.floor(section.duration / section.lectures))}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">
          No course content available
        </div>
      )}
    </div>
  );
};

export default CourseContentList;