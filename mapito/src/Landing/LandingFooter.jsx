import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Mapito</h2>
          <p className="text-sm text-gray-400">Bringing maps and code together with creativity and logic.</p>
        </div>

        {/* Middle: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/about" className="hover:text-gray-300">About</a></li>
            <li><a href="/projects" className="hover:text-gray-300">Projects</a></li>
            <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </div>

        {/* Right: Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <div className="flex items-center space-x-4">
            <a href="mailto:wahwint72@gmail.com" className="hover:text-gray-300 text-lg">
              <FaEnvelope />
            </a>
            <a href="https://github.com/wintwah243" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-lg">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/your-linkedin-id" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-lg">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Wint Wah. All rights reserved.
      </div>
    </footer>
  );
}
