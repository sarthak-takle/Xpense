import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const { searchParams } = new URL(request.url)
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        const dateFilter: any = {}
        if (from || to) {
            if (from) dateFilter.gte = new Date(from)
            if (to) dateFilter.lte = new Date(to)
        }

        // 1. Get Transactions filters
        const where = {
            userId: user.id,
            date: Object.keys(dateFilter).length ? dateFilter : undefined
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: { category: true }
        })

        // 2. Calculate Totals
        let totalIncome = 0
        let totalExpense = 0

        // 3. Category Breakdown
        const expenseByCategory: Record<string, { name: string, color: string, value: number }> = {}
        const incomeByCategory: Record<string, { name: string, color: string, value: number }> = {}

        for (const t of transactions) {
            if (t.type === 'income') {
                totalIncome += t.amount

                if (!incomeByCategory[t.category.name]) {
                    incomeByCategory[t.category.name] = {
                        name: t.category.name,
                        color: t.category.color,
                        value: 0
                    }
                }
                incomeByCategory[t.category.name].value += t.amount

            } else {
                totalExpense += t.amount

                if (!expenseByCategory[t.category.name]) {
                    expenseByCategory[t.category.name] = {
                        name: t.category.name,
                        color: t.category.color,
                        value: 0
                    }
                }
                expenseByCategory[t.category.name].value += t.amount
            }
        }

        // 4. Get Current Balance (Total of all accounts, not filtered by date usually, but maybe we want "balance at end of period"?)
        // Request asks for "Current Balance". We should just sum all accounts balances.
        const customAccounts = await prisma.account.findMany({ where: { userId: user.id } })
        const currentBalance = customAccounts.reduce((sum, acc) => sum + acc.balance, 0)

        return NextResponse.json({
            summary: {
                totalIncome,
                totalExpense,
                currentBalance
            },
            expenseByCategory: Object.values(expenseByCategory),
            incomeByCategory: Object.values(incomeByCategory),
            transactions // Optional if we want list too
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 })
    }
}
