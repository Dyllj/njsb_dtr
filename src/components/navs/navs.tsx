import type { ComponentType, MouseEventHandler, ReactNode } from 'react';

type NavProps = {
  children?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

const Nav = ({ children = 'Follow me', icon: Icon, href = '#', onClick, className = '' }: NavProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative flex items-center rounded-lg px-4 py-2 font-bold transition-all duration-300 ${className}`}
    >
      {/* Icon: starts off-screen to the left (hidden) and slides in on hover */}
      {Icon && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 transform -translate-x-6 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 text-xl">
          <Icon />
        </span>
      )}

      {/* Text: moves right when hovered to make space for the icon */}
      <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-6">
        {children}
      </span>
    </a>
  );
};

export default Nav;