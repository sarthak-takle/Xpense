import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

import { getAuthenticatedUser } from '@/lib/auth'

export async function GET() {
    try {
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const categories = await prisma.category.findMany({
            where: { userId: user.id },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { name, icon, color, type } = body

        if (!name || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const category = await prisma.category.create({
            data: {
                name,
                icon: icon || 'Circle', // Default icon
                color: color || '#000000', // Default color
                type,
                userId: user.id
            }
        })
        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating category' }, { status: 500 })
    }
}
