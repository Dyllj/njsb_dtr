import type { MouseEventHandler } from 'react';
import type { LucideIcon } from 'lucide-react';

type NavProps = {
  children?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  [key: string]: unknown;
};

const Nav = ({
  children = 'Follow me',
  icon: Icon,
  href = '#',
  onClick,
  className = '',
  ...props
}: NavProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      {...props}
      className={`flex items-center gap-2 px-4 py-2 text-zinc-zinc-300 transition-all duration-300 font-Strait font-bold group relative overflow-hidden rounded-lg hover:text-amber-600 ${className}`.trim()}
    >
      <span className="relative z-10 transition-all duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
      {Icon && (
        <Icon className="text-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 transform -translate-x-1" />
      )}
    </a>
  );
};

export default Nav;