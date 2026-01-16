import { prisma } from "@/lib/prisma"
import { TransactionList } from "@/components/TransactionList"
import { TransactionFilters } from "@/components/TransactionFilters"

async function getData(type?: string, period: string = 'all', dateString?: string) {
    const user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } })
    if (!user) return []

    const where: any = { userId: user.id }
    const date = dateString ? new Date(dateString) : new Date()

    // Consolidate logic: 'filter' param from TransactionFilters likely maps to period
    // But since we are unifying, let's respect 'period' fully.

    if (period === 'month') {
        const start = new Date(date.getFullYear(), date.getMonth(), 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
        where.date = { gte: start, lte: end }
    } else if (period === 'year') {
        const start = new Date(date.getFullYear(), 0, 1)
        const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)
        where.date = { gte: start, lte: end }
    } else if (period === 'week') {
        const day = date.getDay()
        const diff = date.getDate() - day + (day === 0 ? -6 : 1)
        const start = new Date(date)
        start.setDate(diff)
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)

        where.date = { gte: start, lte: end }
    }

    if (type) {
        where.type = type
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        include: { category: true }
    })

    return transactions
}

interface PageProps {
    searchParams: Promise<{ filter?: string; type?: string; period?: string; date?: string }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
    const params = await searchParams
    // Fallback: if 'filter' is present (legacy/TransactionFilters), use it as period
    const period = params.period || params.filter || 'all'
    const type = params.type
    const date = params.date
    const transactions = await getData(type, period, date)

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <TransactionFilters />
            </div>

            <TransactionList transactions={transactions} />
        </div>
    )
}
