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
      className={`group flex items-center gap-1 rounded-lg px-4 py-2 font-bold transition-all duration-300 ${className}`}
    >
      <span className="relative z-10 transition-all duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
      {Icon && (
        <Icon className="-translate-x-1 transform text-xl opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
      )}
    </a>
  );
};

export default Nav;