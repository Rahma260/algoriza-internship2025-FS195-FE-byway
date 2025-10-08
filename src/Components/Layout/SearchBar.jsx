import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="navbar-search-container">
      <div className="navbar-search-box">
        <Search className="navbar-search-icon" />
        <input
          type="text"
          placeholder="Search Courses"
          className="navbar-search-input"
        />
      </div>
      <span className="navbar-courses">Courses</span>
    </div>
  );
}
