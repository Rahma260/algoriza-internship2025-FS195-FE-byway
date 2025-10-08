import Logo from "./Logo";
import FooterSection from "./FooterSection";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <FooterSection>
          <div className="mb-4">
            <Logo textClass="text-white font-bold text-lg" />
          </div>
          <p className="footer-text">
            Empowering learners through accessible and engaging online
            education. Byway is a leading online learning platform dedicated to
            providing high-quality, flexible, and affordable educational
            experiences.
          </p>
        </FooterSection>

        <FooterSection title="Get Help">
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Contact Us</a></li>
            <li><a href="#" className="footer-link">Latest Articles</a></li>
            <li><a href="#" className="footer-link">FAQ</a></li>
          </ul>
        </FooterSection>

        <FooterSection title="Programs">
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Art & Design</a></li>
            <li><a href="#" className="footer-link">Business</a></li>
            <li><a href="#" className="footer-link">IT & Software</a></li>
            <li><a href="#" className="footer-link">Languages</a></li>
            <li><a href="#" className="footer-link">Programming</a></li>
          </ul>
        </FooterSection>

        <FooterSection title="Contact Us">
          <p className="footer-text mb-2">Address: 123 Main Street, Anytown, CA 12345</p>
          <p className="footer-text mb-2">Tel: +(123) 456-7890</p>
          <p className="footer-text mb-4">Mail: bywayedu@webkul.in</p>
          <SocialIcons />
        </FooterSection>

      </div>
    </footer>
  );
}
