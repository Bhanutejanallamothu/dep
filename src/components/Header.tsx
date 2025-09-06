
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShoppingCart, User, Menu, PlusCircle, List, Heart, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import AppSidebar from "./AppSidebar";
import { cn } from "@/lib/utils";

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Button asChild variant="ghost" className={cn(isActive && "bg-secondary text-secondary-foreground")}>
            <Link href={href}>{children}</Link>
        </Button>
    )
}

export default function Header() {
  const { user, logout, cart } = useAppContext();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt={user?.username} />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account"><User className="mr-2 h-4 w-4" /><span>My Account</span></Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const DesktopNav = () => (
     <div className="hidden md:flex items-center gap-2">
        <NavLink href="/products/new"><PlusCircle className="mr-2" />Sell</NavLink>
        <NavLink href="/my-listings"><List className="mr-2" />Listings</NavLink>
        <NavLink href="/purchases"><Heart className="mr-2" />Purchases</NavLink>
    </div>
  )

  const MobileNav = () => (
    <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle Menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[300px]">
            <AppSidebar />
        </SheetContent>
    </Sheet>
  )

  if (!isClient) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
             <div className="container flex h-16 items-center" />
        </header>
    );
  }
  
  const authRoutes = ['/login', '/signup'];
  if (authRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
            <MobileNav />
            <Logo />
            { user && <DesktopNav /> }
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{cart.length}</span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
