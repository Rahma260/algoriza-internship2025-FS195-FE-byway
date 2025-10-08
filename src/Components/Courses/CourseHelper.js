export const getLevelName = (level) => {
  if (level === undefined || level === null) return "All Levels";

  if (typeof level === 'string') {
    const levelMap = {
      'AllLevels': 'All Levels',
      'Beginner': 'Beginner',
      'Intermediate': 'Intermediate',
      'Expert': 'Expert'
    };
    return levelMap[level] || level;
  }

  const levels = {
    0: "All Levels",
    1: "Beginner",
    2: "Intermediate",
    3: "Expert"
  };
  return levels[level] ?? "All Levels";
};

export const getTotalLectures = (contents) => {
  if (!contents || !Array.isArray(contents)) return 0;
  return contents.reduce((total, content) => {
    const lectures = parseInt(content.lecturesNumber) || 0;
    return total + lectures;
  }, 0);
};