import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Mapito header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Mapito</h2>
          <p className="text-sm text-gray-400">Bringing maps and code together with creativity and logic.</p>
        </div>

        {/* Quick Links in middle */}
        <div className="">
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 space-y-1 text-sm">
            <li><a href="/home" className="hover:text-gray-300">Home</a></li>
            <li><a href="/aboutus" className="hover:text-gray-300">About</a></li>
            <li><a href="/quiz" className="hover:text-gray-300">Quiz</a></li>
            <li><a href="/typing-test" className="hover:text-gray-300">Typing test</a></li>
            <li><a href="/code" className="hover:text-gray-300">Problems</a></li>
            <li><a href="/summarize" className="hover:text-gray-300">QuickNotes</a></li>
            <li><a href="/codinggame" className="hover:text-gray-300">Coding games</a></li>
            <li><a href="/documentation" className="hover:text-gray-300">Documentation</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <div className="flex items-center space-x-4">
            <a href="mailto:wahwint72@gmail.com" className="hover:text-gray-300 text-lg">
              <FaEnvelope />
            </a>
            <a href="https://github.com/wintwah243" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-lg">
              <FaGithub />
            </a>
            <a href="http://linkedin.com/in/wint-wah-386240307" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 text-lg">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* for copyright */}
      <div className="mt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Wint Wah. All rights reserved.
      </div>
    </footer>
  );
}
