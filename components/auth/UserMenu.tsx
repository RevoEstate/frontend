import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Home, Bookmark, PlusSquare, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient, signOut, useSession } from '@/lib/auth-client';



// Animation variants
const dropdownVariants = {
  hidden: { 
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.2,
      ease: "easeInOut",
      staggerChildren: 0.05,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const UserMenu = () => {
  const { data: session, status } = useSession();
  const user = session?.user;


  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <Button variant="ghost" className="h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-200">
            <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!user) {
    return (
      <Button 
        asChild 
        variant='secondary' 
        size="sm" 
        className='bg-sky-600 text-white font-semibold hover:bg-sky-600/80'
        aria-label="Sign in"
      >
        <Link href="/sign-in" className="flex items-center gap-2">
          Sign In
          <User className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  const firstInitial = user?.firstName?.charAt(0).toUpperCase() ?? '';

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="User menu"
          >
            <Avatar className="h-10 w-10 cursor-pointer">
              {user.image && (
                <AvatarImage 
                  src={user.image} 
                  alt={user.name || "User avatar"}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="bg-sky-700 text-white text-xl">
                {firstInitial || <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <AnimatePresence>
          <DropdownMenuContent 
            className="w-56" 
            align="end" 
            forceMount
            asChild
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              className="rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <motion.div variants={itemVariants} className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </motion.div>
              </DropdownMenuLabel>

              {/* Mobile-only dropdown links (hidden on desktop) */}
              <div className="md:hidden space-y-1">
                <DropdownMenuSeparator />
                
                <motion.div variants={itemVariants}>
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/properties" 
                      className="w-full cursor-pointer flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Link>
                  </DropdownMenuItem>
                </motion.div>

                {user && (
                  <motion.div variants={itemVariants}>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/bookmarks" 
                        className="w-full cursor-pointer flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        Saved Properties
                      </Link>
                    </DropdownMenuItem>
                  </motion.div>
                )}

                {user?.role === 'agent' && (
                  <>
                    <motion.div variants={itemVariants}>
                      <DropdownMenuItem asChild>
                        {/* <Link 
                          href="/properties/create" 
                          className="w-full cursor-pointer flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <PlusSquare className="mr-2 h-4 w-4" />
                          Create Listing
                        </Link> */}
                      </DropdownMenuItem>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/realestate" 
                          className="w-full cursor-pointer flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </motion.div>
                  </>
                )}

                {user?.role === 'systemAdmin' && (
                  <motion.div variants={itemVariants}>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/admin" 
                        className="w-full cursor-pointer flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </motion.div>
                )}
              </div>
              
              {/* Profile Link */}
              <motion.div variants={itemVariants}>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/profile" 
                    className="w-full cursor-pointer flex items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Profile"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </motion.div>
                          
              {/* Logout */}
              <motion.div variants={itemVariants}>
                <DropdownMenuItem 
                  className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleSignOut}
                  aria-label="Log out"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </motion.div>
            </motion.div>
          </DropdownMenuContent>
        </AnimatePresence>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;