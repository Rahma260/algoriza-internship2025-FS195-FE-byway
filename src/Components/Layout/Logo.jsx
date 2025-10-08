import logo from "../../../public/images/logo.png";

export default function Logo({ textClass = "navbar-logo-text" }) {
  return (
    <div className="navbar-logo">
      <img src={logo} alt="BYWay Logo" />
      <span className={textClass}>BYWay</span>
    </div>
  );
}
