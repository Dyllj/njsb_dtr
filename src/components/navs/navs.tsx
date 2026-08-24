import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type NavProps = {
  children?: ReactNode;
  icon?: LucideIcon;
  to: string;
  className?: string;
  [key: string]: unknown;
};

const Nav = ({
  children = 'Follow me',
  icon: Icon,
  to,
  className = '',
  ...props
}: NavProps) => {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      {...props}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 transition-all duration-300 font-Strait font-bold group relative overflow-hidden rounded-lg hover:text-white ${
          isActive ? 'bg-red-900/60 text-white' : 'text-zinc-300'
        } ${className}`.trim()
      }
    >
      <span className="relative z-10 transition-all duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
      {Icon && (
        <Icon className="text-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 transform -translate-x-1" />
      )}
    </NavLink>
  );
};

export default Nav;