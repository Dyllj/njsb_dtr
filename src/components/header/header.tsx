import { ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type HeaderProps = {
  onLogout?: () => void;
  onMenuToggle?: () => void;
  isMobileNavOpen?: boolean;
};

function Header({ onLogout, onMenuToggle, isMobileNavOpen }: HeaderProps) {
  return (
    <header className="h-16 bg-white p-4 shadow-sm">
      <div className="flex h-full items-center justify-between gap-3 sm:gap-7">
        <div className="flex min-w-0 items-center gap-2 sm:gap-7">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
            aria-label={isMobileNavOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
          <p className="truncate text-xl font-bold sm:text-2xl">NJSB DTR</p>
          <p className="hidden text-base font-semibold text-muted-foreground sm:block">
            Daily Time Report
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 text-slate-700 hover:text-slate-900"
              aria-label="User menu"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-red-800/10 text-sm font-semibold text-red-800">
                  AU
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Admin User</span>
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <User className="size-4" aria-hidden="true" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="size-4" aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                onLogout?.();
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header
