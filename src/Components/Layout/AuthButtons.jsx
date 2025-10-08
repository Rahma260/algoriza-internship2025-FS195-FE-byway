import { Link } from 'react-router-dom';
export default function AuthButtons() {
  return (
    <div className="flex items-center gap-6">
      <Link to="/login">
        <button className="navbar-btn navbar-login"> Login</button></Link>
      <Link to="/register"><button className="navbar-btn navbar-signup">Sign Up</button></Link>
    </div>
  );
}
