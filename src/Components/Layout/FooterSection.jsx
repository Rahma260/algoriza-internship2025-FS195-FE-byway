export default function FooterSection({ title, children }) {
  return (
    <div>
      {title && <h3 className="footer-title">{title}</h3>}
      {children}
    </div>
  );
}
