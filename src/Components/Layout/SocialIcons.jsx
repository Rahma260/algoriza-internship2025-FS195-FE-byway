import { FaGithub, FaTwitter, FaLinkedin, FaGoogle, FaFacebook } from "react-icons/fa";

export default function SocialIcons() {
  return (
    <div className="flex gap-4">
      <a href="https://www.facebook.com/"><FaFacebook className="social-icon social-facebook" /></a>
      <a href="https://github.com/"><FaGithub className="social-icon social-github" /></a>
      <a href="https://www.google.com/?zx=1759853801267&no_sw_cr=1"><FaGoogle className="social-icon social-google" /></a>
      <a href="https://x.com/?lang=en"><FaTwitter className="social-icon social-twitter" /></a>
      <a href="https://www.linkedin.com/"><FaLinkedin className="social-icon social-linkedin" /></a>
    </div>
  );
}
