function SocialButton({ children, icon, color, hoverColor }) {
  return (
    <button
      className={`auth-social ${color} hover:${hoverColor}`}
    >
      {children} {icon}
    </button>
  );
}

export default SocialButton;
