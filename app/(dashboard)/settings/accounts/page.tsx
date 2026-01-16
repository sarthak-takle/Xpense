import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Plus } from "lucide-react"

async function getData() {
    const user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } })
    if (!user) return []

    return await prisma.account.findMany({
        where: { userId: user.id },
        orderBy: { name: 'asc' }
    })
}

export default async function AccountsPage() {
    const accounts = await getData()

    return (
        <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Accounts</h1>
                <Link href="/settings/accounts/new">
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add</Button>
                </Link>
            </div>

            <div className="space-y-3">
                {accounts.map(acc => (
                    <div key={acc.id} className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="font-medium text-white">{acc.name}</p>
                            <p className="text-xs text-gray-400">{acc.type} • {acc.currency}</p>
                        </div>
                        <div className="text-lg font-bold text-white">
                            ₹{acc.balance.toLocaleString('en-IN')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
