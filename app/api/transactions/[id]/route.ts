import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper to reverse transaction effect on balance
function getReverseBalanceUpdate(type: string, amount: number) {
    // If it was income (added), we subtract. If expense (subtracted), we add.
    return type === 'income' ? { decrement: amount } : { increment: amount }
}

function getBalanceUpdate(type: string, amount: number) {
    return type === 'income' ? { increment: amount } : { decrement: amount }
}

import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { category: true, account: true }
    })

    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    if (transaction.userId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    return NextResponse.json(transaction)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const transaction = await prisma.transaction.findUnique({ where: { id } })
        if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
        if (transaction.userId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

        await prisma.$transaction(async (tx) => {
            // 1. Revert balance on Account
            await tx.account.update({
                where: { id: transaction.accountId },
                data: { balance: getReverseBalanceUpdate(transaction.type, transaction.amount) }
            })

            // 2. Delete Transaction
            await tx.transaction.delete({ where: { id } })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { amount, type, date, note, categoryId, accountId } = body

        // Existing transaction
        const oldTransaction = await prisma.transaction.findUnique({ where: { id } })
        if (!oldTransaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
        if (oldTransaction.userId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

        const parsedAmount = parseFloat(amount)

        const result = await prisma.$transaction(async (tx) => {
            // 1. Revert old transaction logic on OLD account
            await tx.account.update({
                where: { id: oldTransaction.accountId },
                data: { balance: getReverseBalanceUpdate(oldTransaction.type, oldTransaction.amount) }
            })

            // 2. Apply new transaction logic on NEW account (even if same)
            // We reverted the old one completely, so now we just act like adding a fresh one.
            // This handles amount change, type change, AND account switch all in one.
            await tx.account.update({
                where: { id: accountId },
                data: { balance: getBalanceUpdate(type, parsedAmount) }
            })

            // 3. Update Transaction Record
            const updated = await tx.transaction.update({
                where: { id },
                data: {
                    amount: parsedAmount,
                    type,
                    date: date ? new Date(date) : undefined,
                    note,
                    categoryId,
                    accountId
                },
                include: { category: true, account: true }
            })

            return updated
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 })
    }
}
