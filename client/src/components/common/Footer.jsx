import { Link } from 'react-router-dom';
import { FaBriefcase, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-slate-300">
      {/* Top gradient border */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-500 shadow-lg shadow-slate-500/20">
                <FaBriefcase className="text-sm text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="bg-gradient-to-r from-slate-400 to-slate-400 bg-clip-text text-transparent">Portal</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Discover your dream career. Connect with top employers and find opportunities that match your skills and ambitions.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:text-white hover:shadow-lg"
              >
                <FaGithub className="text-base" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-600 hover:text-white hover:shadow-lg hover:shadow-slate-500/25"
              >
                <FaLinkedin className="text-base" />
              </a>
              <a
                href="mailto:hello@jobportal.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-600 hover:text-white hover:shadow-lg hover:shadow-slate-500/25"
              >
                <FaEnvelope className="text-base" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Browse Jobs', path: '/jobs' },
                { name: 'Post a Job', path: '/post-job' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-slate-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-xs text-slate-400" />
                hello@jobportal.com
              </li>
              <li>New Delhi, India</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <p>
            Built with{' '}
            <span className="bg-gradient-to-r from-slate-400 to-slate-400 bg-clip-text font-medium text-transparent">
              React &amp; Tailwind CSS
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
