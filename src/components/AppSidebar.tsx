
"use client"

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import Logo from "./Logo"
import { Home, List, Heart, User, LogOut, PlusCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function AppSidebar() {
    const pathname = usePathname();
    const { user, logout, cart } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // The user object is loaded from localStorage, which is only available on the client.
      // We set loading to false after the component mounts to ensure the client-side render
      // matches the server-side render initially.
      setIsLoading(false);
    }, []);


    const menuItems = [
      { href: "/", label: "Home", icon: Home },
      { href: "/products/new", label: "Sell an Item", icon: PlusCircle },
      { href: "/my-listings", label: "My Listings", icon: List },
      { href: "/purchases", label: "My Purchases", icon: Heart },
      { href: "/cart", label: "Cart", icon: ShoppingCart },
      { href: "/account", label: "My Account", icon: User },
    ];

    if (isLoading) {
        return (
             <div className="flex flex-col h-full">
                <SidebarHeader>
                    <Logo />
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                    </SidebarMenu>
                </SidebarContent>
            </div>
        )
    }


    if (!user) {
        return (
             <div className="flex flex-col h-full">
                <SidebarHeader>
                    <Logo />
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <div className="flex flex-col gap-2">
                        <Button asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                         <Button asChild variant="secondary">
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </SidebarContent>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} className="w-full">
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    className="w-full justify-start"
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                    {item.href === '/cart' && cart.length > 0 && (
                                        <span className="ml-auto bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>
                                    )}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout} className="w-full justify-start">
                            <LogOut />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
            </SidebarFooter>
        </div>
    )
}
