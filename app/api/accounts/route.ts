import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { getAuthenticatedUser } from '@/lib/auth'

// Allow creating accounts (Cash, Bank, Wallet)
export async function GET() {
    try {
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const accounts = await prisma.account.findMany({
            where: { userId: user.id },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(accounts)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching accounts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { name, type, balance, currency } = body

        if (!name || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const account = await prisma.account.create({
            data: {
                name,
                type,
                balance: parseFloat(balance) || 0,
                currency: currency || 'INR',
                userId: user.id
            }
        })
        return NextResponse.json(account)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating account' }, { status: 500 })
    }
}
