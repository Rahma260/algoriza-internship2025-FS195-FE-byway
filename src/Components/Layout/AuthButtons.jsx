import { Link } from 'react-router-dom';
export default function AuthButtons() {
  return (
    <div className="flex items-center gap-6">
      <button className="navbar-btn navbar-login"><Link to="/login"> Login</Link></button>
      <button className="navbar-btn navbar-signup"><Link to="/register">Sign Up</Link></button>
    </div>
  );
}
