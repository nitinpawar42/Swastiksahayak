"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Wind, User as UserIcon, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logout } from "@/lib/actions/user";
import { useToast } from "@/hooks/use-toast";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/reseller/dashboard", label: "Reseller Dashboard"},
  { href: "/admin/dashboard", label: "Admin"},
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, userDetails, loading } = useAuth();

  const isAdminRoute = pathname.startsWith('/admin');

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out."});
      router.push('/');
    } catch (error) {
      toast({ title: "Logout Failed", description: "Something went wrong.", variant: "destructive"});
    }
  }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Wind className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Swastik Sahayak
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium font-body">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full">
                    <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                        <Wind className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">Swastik Sahayak</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search here later */}
          </div>
          <nav className="flex items-center gap-2">
            {!loading && (
              <>
                {user ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatar-placeholder.png" alt={userDetails?.name} />
                          <AvatarFallback>{getInitials(userDetails?.name)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{userDetails?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                        {userDetails?.role === 'admin' && (
                            <DropdownMenuItem asChild>
                                <Link href="/admin/dashboard"><UserIcon className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                            </DropdownMenuItem>
                        )}
                         {userDetails?.role === 'reseller' && (
                            <DropdownMenuItem asChild>
                                <Link href="/reseller/dashboard"><UserIcon className="mr-2 h-4 w-4" />Reseller Dashboard</Link>
                            </DropdownMenuItem>
                        )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href={isAdminRoute ? "/admin/login" : "/login"}>Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
