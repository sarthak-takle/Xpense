import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@example.com',
                name: 'Demo User',
                accounts: {
                    create: { name: 'Cash', type: 'Cash', balance: 0 }
                }
            }
        })
        console.log('Created demo user')
    }

    const expenseCategories = [
        { name: 'Food', color: '#f59e0b', icon: 'Utensils' },
        { name: 'Transport', color: '#3b82f6', icon: 'Bus' },
        { name: 'Bills', color: '#ef4444', icon: 'Receipt' },
        { name: 'Entertainment', color: '#8b5cf6', icon: 'Film' },
        { name: 'Health', color: '#ec4899', icon: 'Stethoscope' },
        { name: 'House', color: '#10b981', icon: 'Home' },
        { name: 'Fruits', color: '#84cc16', icon: 'Apple' },
        { name: 'Gifts', color: '#f43f5e', icon: 'Gift' },
        { name: 'Education / Stationery', color: '#6366f1', icon: 'GraduationCap' },
        { name: 'Taxi', color: '#eab308', icon: 'Car' },
        { name: 'Recharges', color: '#06b6d4', icon: 'Smartphone' },
        { name: 'Pets', color: '#d946ef', icon: 'Dog' },
        { name: 'Miscellaneous', color: '#64748b', icon: 'MoreHorizontal' },
    ]

    const incomeCategories = [
        { name: 'Salary', color: '#10b981', icon: 'Banknote' },
        { name: 'Credit', color: '#3b82f6', icon: 'CreditCard' },
        { name: 'Deposit', color: '#8b5cf6', icon: 'Landmark' },
        { name: 'Misc', color: '#64748b', icon: 'MoreHorizontal' },
    ]

    console.log('Seeding/Updating Expense Categories...')
    for (const cat of expenseCategories) {
        const existing = await prisma.category.findFirst({
            where: { userId: user.id, name: cat.name, type: 'expense' }
        })

        if (existing) {
            // Update icon if it exists
            await prisma.category.update({
                where: { id: existing.id },
                data: { icon: cat.icon }
            })
            console.log(`Updated icon for: ${cat.name}`)
        } else {
            await prisma.category.create({
                data: {
                    name: cat.name,
                    color: cat.color,
                    icon: cat.icon,
                    type: 'expense',
                    userId: user.id
                }
            })
            console.log(`Created expense category: ${cat.name}`)
        }
    }

    console.log('Seeding/Updating Income Categories...')
    for (const cat of incomeCategories) {
        const existing = await prisma.category.findFirst({
            where: { userId: user.id, name: cat.name, type: 'income' }
        })

        if (existing) {
            await prisma.category.update({
                where: { id: existing.id },
                data: { icon: cat.icon }
            })
            console.log(`Updated icon for: ${cat.name}`)
        } else {
            await prisma.category.create({
                data: {
                    name: cat.name,
                    color: cat.color,
                    icon: cat.icon,
                    type: 'income',
                    userId: user.id
                }
            })
            console.log(`Created income category: ${cat.name}`)
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
