import { prisma } from "@/lib/prisma"
import { TransactionForm } from "@/components/TransactionForm"
import { getAuthenticatedUser } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getData() {
    const user = await getAuthenticatedUser()

    if (!user) return redirect('/sign-in')

    const categories = await prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { name: 'asc' }
    })

    // If no categories, maybe add defaults? 
    // For the demo, if categories empty, we should seed them.
    if (categories.length === 0) {
        // Seed logic could go here or in a separate step.
        // Let's rely on manual seed or "Manage Categories" to add.
        // Or auto-seed defaults:
        const defaultCats = [
            { name: 'Food', type: 'expense', color: '#f59e0b' },
            { name: 'Transport', type: 'expense', color: '#3b82f6' },
            { name: 'Bills', type: 'expense', color: '#ef4444' },
            { name: 'Entertainment', type: 'expense', color: '#8b5cf6' },
            { name: 'Salary', type: 'income', color: '#10b981' }
        ]
        // Quick seed for seamless demo
        for (const c of defaultCats) {
            await prisma.category.create({
                data: { ...c, icon: 'Circle', userId: user.id }
            })
        }
        // Re-fetch
        return {
            categories: await prisma.category.findMany({ where: { userId: user.id } }),
            accounts: await prisma.account.findMany({ where: { userId: user.id } })
        }
    }

    const accounts = await prisma.account.findMany({
        where: { userId: user.id },
        orderBy: { name: 'asc' }
    })

    return { categories, accounts }
}

export default async function AddPage() {
    const { categories, accounts } = await getData()

    return (
        <div className="max-w-md mx-auto flex flex-col h-[calc(100vh-85px)]">
            <h1 className="text-xl font-bold mb-6 flex-shrink-0">New Transaction</h1>
            <div className="flex-1 min-h-0">
                <TransactionForm categories={categories} accounts={accounts} />
            </div>
        </div>
    )
}
