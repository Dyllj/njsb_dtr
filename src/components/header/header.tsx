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

function Header() {
  return (
    <header className="fixed left-52 top-0 right-0 z-30 h-16 bg-white p-4 shadow-sm">
      <div className="flex h-full items-center justify-between gap-7">
        <div className="flex items-center gap-7">
          <h1 className="text-2xl font-bold">NJSB DTR</h1>
          <h1 className="text-lg font-semibold text-muted-foreground">
            Daily Time Report
          </h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 text-slate-700 hover:text-slate-900"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-red-800/10 text-sm font-semibold text-red-800">
                  AU
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Admin User</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
