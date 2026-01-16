"use client"
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Wallet, Settings, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/Button'

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/transactions', label: 'Transactions', icon: Receipt },
        { href: '/categories', label: 'Categories', icon: Wallet },
        { href: '/settings', label: 'Settings', icon: Settings },
    ]

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-800 bg-gray-950 px-4 py-6 fixed left-0 top-0 z-50">
            <div className="flex items-center space-x-2 px-2 mb-8">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-black">$</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Xpense</span>
            </div>

            <div className="space-y-1">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-green-500/10 text-green-500"
                                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                            )}
                        >
                            <Icon size={20} className="mr-3" />
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="mt-auto px-2 border-t border-gray-800 pt-4">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <UserButton showName />
                    <span className="text-sm font-medium text-gray-400">Profile</span>
                </div>
            </div>

        </aside>
    )
}
