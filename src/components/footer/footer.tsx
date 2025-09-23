import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full z-50 bg-gradient-to-r from-blue-500/80 to-blue-700/80 shadow-2xl mt-auto backdrop-blur-md border-t border-blue-200/40 relative">
      <div className="h-1 w-full bg-gradient-to-r from-yellow-300 via-blue-400 to-pink-400 animate-gradient-x absolute top-0 left-0" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4">
        <p className="text-lg font-semibold tracking-wide drop-shadow text-white">&copy; {new Date().getFullYear()} A Better Neighbourhood. All Rights Reserved.</p>
        <div className="flex gap-6 justify-center md:justify-end">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-transform hover:scale-125" aria-label="GitHub"><Github size={28} /></a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-transform hover:scale-125" aria-label="LinkedIn"><Linkedin size={28} /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-transform hover:scale-125" aria-label="Twitter"><Twitter size={28} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
