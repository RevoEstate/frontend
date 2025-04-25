"use client"

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import { Home, LineChart, Package, Settings, Users, PlusSquare, Menu, User, LogOut, PackageOpen, Bell, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { signOut, useSession } from '@/lib/auth-client'
import { RiProfileFill } from 'react-icons/ri'

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
}

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
}

// Updated navItems with subItems for Packages
const navItems = [
    { name: "Dashboard", href: "/realestate", icon: Home },
    { name: "Properties", href: "/realestate/properties", icon: Package },
    { name: "Add Property", href: "/realestate/properties/create", icon: PlusSquare },
    { name: "Appointments", href: "/realestate/customers", icon: Bell },
    { name: "Profile", href: "/realestate/profile", icon: RiProfileFill },
    {
        name: "Packages",
        href: "/realestate/packages",
        icon: PackageOpen,
        subItems: [
            { name: "All Packages", href: "/realestate/packages" },
            { name: "My Packages", href: "/realestate/packages/my-packages" },
        ],
    },
]

const RealestateSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const user = session?.user
    const { state } = useSidebar()

    const handleSignOut = async () => {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/')
                    },
                },
            })
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const firstInitial = user?.firstName?.charAt(0).toUpperCase() ?? ''

    return (
      <Sidebar collapsible="icon" {...props} className="">
        {state === 'expanded' && (
          <SidebarHeader className="container py-6">
              <Link href="/" className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
                      RevoEstate
                  </h1>
              </Link>
          </SidebarHeader>
        )}

        <SidebarContent>
          <SidebarGroup>
              <SidebarGroupContent>
                  <SidebarMenu>
                      {navItems.map((item) => (
                          <SidebarMenuItem key={item.name}>
                              {item.subItems ? (
                                  <Collapsible defaultOpen={pathname.startsWith(item.href)}>
                                      <CollapsibleTrigger asChild className='cursor-pointer'>
                                          <SidebarMenuButton
                                              className={`hover:bg-sky-100/60 text-normal ${
                                                  pathname === item.href && 'bg-sky-200/50 hover:bg-sky-200/70 font-semibold'
                                              }`}
                                          >
                                              <item.icon />
                                              <span>{item.name}</span>
                                              <ChevronRight className="ml-auto h-4 w-4" />
                                          </SidebarMenuButton>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                          <SidebarMenuSub>
                                              {item.subItems.map((subItem) => (
                                                  <SidebarMenuSubItem key={subItem.name}>
                                                      <SidebarMenuSubButton
                                                          asChild
                                                          className={`hover:bg-sky-100/60 text-normal ${
                                                              pathname === subItem.href &&
                                                              'bg-sky-200/50 hover:bg-sky-200/70 font-semibold'
                                                          }`}
                                                      >
                                                          <Link href={subItem.href}>
                                                              <span>{subItem.name}</span>
                                                          </Link>
                                                      </SidebarMenuSubButton>
                                                  </SidebarMenuSubItem>
                                              ))}
                                          </SidebarMenuSub>
                                      </CollapsibleContent>
                                  </Collapsible>
                              ) : (
                                  <SidebarMenuButton
                                      asChild
                                      className={`hover:bg-sky-100/60 text-normal ${
                                          pathname === item.href && 'bg-sky-200/50 hover:bg-sky-200/70 font-semibold'
                                      }`}
                                  >
                                      <Link href={item.href}>
                                          <item.icon />
                                          <span>{item.name}</span>
                                      </Link>
                                  </SidebarMenuButton>
                              )}
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mb-10">
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="User menu"
                            >
                                <Avatar className="h-10 w-10 cursor-pointer">
                                    {user?.image && (
                                        <AvatarImage
                                            src={user.image}
                                            alt={user.firstName || "User avatar"}
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
                                className="w-58 mx-3"
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
                                            <p className="text-sm font-medium leading-none">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-xs leading-none Experiments with Grok, created by xAI text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </motion.div>
                                    </DropdownMenuLabel>

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
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
}

export default RealestateSidebar