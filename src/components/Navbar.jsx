import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/aegisai-logo.png';

const linkClass = ({ isActive }) =>
  `text-sm transition ${isActive ? 'text-violetSoft' : 'text-slate-400 hover:text-white'}`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="" className="h-9 w-auto select-none" draggable={false} />
          <span className="font-semibold tracking-wide text-chrome">AegisAI</span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Live demo
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
