import { FaLinkedin, FaGithub, FaYoutube, FaHeart } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { name: "GitHub", icon: FaGithub, url: "https://github.com/imaCod3r", color: "hover:text-white" },
    { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/in/edson-rodrigues-b35738267/", color: "hover:text-blue-500" },
    { name: "YouTube", icon: FaYoutube, url: "https://www.youtube.com/@therealfreizin", color: "hover:text-red-500" },
  ];

  return (
    <footer className="bg-black border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Brand & Copy */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold font-mono text-white mb-2">
              <span className="text-white/50">&lt;</span>
              Edson Rodrigues
              <span className="text-white/50">/&gt;</span>
            </h3>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 text-2xl transition-all duration-300 transform hover:scale-125 hover:text-white"
                aria-label={social.name}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center text-gray-600 text-sm flex items-center justify-center gap-2">
          <span>Feito com</span>
          <FaHeart className="text-white animate-pulse" />
          <span>e muito código.</span>
        </div>
      </div>
    </footer>
  );
}
