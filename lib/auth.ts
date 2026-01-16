import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUser() {
    console.log("[Auth] Using Local DEMO User (No Clerk)");

    // Hardcoded Demo User for Local Development
    const demoUser = {
        id: "user_demo_123",
        email: "demo@example.com",
        name: "Demo User"
    };

    // Check if user exists in local DB
    const dbUser = await prisma.user.findUnique({
        where: { email: demoUser.email },
        include: { accounts: true }
    });

    let user = dbUser;

    if (!user) {
        console.log("[Auth] Creating Demo User in DB...");
        try {
            user = await prisma.user.create({
                data: {
                    id: demoUser.id,
                    email: demoUser.email,
                    name: demoUser.name,
                },
                include: { accounts: true }
            });
        } catch (e) {
            console.error("[Auth] Failed to create demo user:", e);
            throw e;
        }
    }

    // Seed Defaults if no accounts
    if (user && user.accounts.length === 0) {
        console.log("[Auth] Seeding default accounts...");
        await prisma.$transaction(async (tx: any) => {
            await tx.account.create({
                data: {
                    name: "Cash",
                    type: "Cash",
                    userId: user.id,
                    balance: 0,
                    currency: "INR"
                }
            })

            const defaults = [
                { name: 'Food', type: 'expense', color: '#f59e0b', icon: 'Utensils' },
                { name: 'Transport', type: 'expense', color: '#3b82f6', icon: 'Bus' },
                { name: 'Bills', type: 'expense', color: '#ef4444', icon: 'Receipt' },
                { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'ShoppingBag' },
                { name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'Film' },
                { name: 'Health', type: 'expense', color: '#10b981', icon: 'HeartPulse' },
                { name: 'Salary', type: 'income', color: '#10b981', icon: 'Wallet' },
                { name: 'Investment', type: 'income', color: '#6366f1', icon: 'TrendingUp' },
            ]

            for (const cat of defaults) {
                await tx.category.create({
                    data: { ...cat, userId: user.id }
                })
            }
        })

        return await prisma.user.findUnique({ where: { id: user.id } })
    }

    return user;
}
