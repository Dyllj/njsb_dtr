import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
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

function Header({ onLogout }: { onLogout?: () => void }) {
  return (
    <header className="h-16 bg-white p-4 shadow-sm">
      <div className="flex h-full items-center justify-between gap-7">
        <div className="flex items-center gap-7">
          <h1 className="text-2xl font-bold">NJSB DTR</h1>
          <h2 className="text-lg font-semibold text-muted-foreground hidden sm:block">
            Daily Time Report
          </h2>
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
              <span className="text-sm font-medium hidden md:inline">Admin User</span>
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
