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
        `flex items-center gap-3 px-3 py-2.5 transition-all duration-300 font-medium group relative overflow-hidden rounded-lg ${
          isActive ? 'bg-red-900/60 text-white' : 'text-zinc-300 hover:text-white hover:bg-red-900/20'
        } ${className}`.trim()
      }
      aria-current={isActive => isActive ? 'page' : undefined}
    >
      {Icon && (
        <Icon className="size-5 text-current transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
      )}
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
    </NavLink>
  );
};

export default Nav;