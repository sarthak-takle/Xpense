import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Wallet, Info, ChevronRight } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-4">
                <Link href="/settings/accounts">
                    <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <Wallet className="h-6 w-6 text-green-500" />
                            <div>
                                <p className="font-medium text-white">Accounts</p>
                                <p className="text-xs text-gray-400">Manage your bank accounts & wallets</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                    </div>
                </Link>

                <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
                    <div className="flex items-center space-x-4 mb-2">
                        <Info className="h-6 w-6 text-blue-500" />
                        <p className="font-medium text-white">About</p>
                    </div>
                    <p className="text-sm text-gray-400 pl-10">
                        Expense Tracker v1.0.0
                        <br />  Built with Next.js, Prisma, & TailwindCSS.
                    </p>
                </div>
            </div>
        </div>
    )
}
