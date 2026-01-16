import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get('categoryId')
        const accountId = searchParams.get('accountId')
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        const where: any = { userId: user.id }
        if (categoryId) where.categoryId = categoryId
        if (accountId) where.accountId = accountId
        if (from || to) {
            where.date = {}
            if (from) where.date.gte = new Date(from)
            if (to) where.date.lte = new Date(to)
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                category: true,
                account: true
            }
        })
        return NextResponse.json(transactions)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { amount, type, date, note, categoryId, accountId } = body

        if (!amount || !type || !categoryId || !accountId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const parsedAmount = parseFloat(amount)

        // Use interactive transaction to update balance + create record
        const result = await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    amount: parsedAmount,
                    type,
                    date: date ? new Date(date) : new Date(),
                    note,
                    categoryId,
                    accountId,
                    userId: user.id
                },
                include: { category: true, account: true }
            })

            // Update Account Balance
            // Income -> Add to balance
            // Expense -> Subtract from balance
            // What if type is transfer? Require logic, but spec says "Income" and "Expense".
            const isIncome = type === 'income'
            const op = isIncome ? { increment: parsedAmount } : { decrement: parsedAmount }

            await tx.account.update({
                where: { id: accountId },
                data: { balance: op }
            })

            return transaction
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 })
    }
}
