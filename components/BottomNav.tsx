"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, PlusCircle, Wallet, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/transactions', label: 'Trans.', icon: Receipt },
        // Center button is usually "Add"
        { href: '/add', label: 'Add', icon: PlusCircle, special: true },
        { href: '/categories', label: 'Cats', icon: Wallet },
        { href: '/settings', label: 'Settings', icon: Settings }, // Accounts can be under settings
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-950 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    if (link.special) {
                        return (
                            <Link key={link.href} href={link.href}>
                                <div className="flex flex-col items-center justify-center text-green-500 hover:text-green-400">
                                    <Icon size={40} strokeWidth={1.5} className="mb-1" />
                                </div>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors hover:text-green-400",
                                isActive ? "text-green-500" : "text-gray-400"
                            )}
                        >
                            <Icon size={24} strokeWidth={1.5} className="mb-1" />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
