import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return null;
    }

    // Check if user exists in local DB
    const dbUser = await prisma.user.findUnique({
        where: { email: clerkUser.emailAddresses[0].emailAddress },
        include: { accounts: true }
    });

    if (!dbUser) {
        console.log("[Auth] New User Detected. Syncing...");
        // valid email check
        const email = clerkUser.emailAddresses[0].emailAddress;
        if (!email) return null;

        // Create User
        const newUser = await prisma.user.create({
            data: {
                id: clerkUser.id,
                email: email,
                name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim() || 'User',
                accounts: {
                    create: { name: 'Cash', type: 'Cash', balance: 0 }
                }
            }
        });

        // Seed Categories safely
        await seedCategories(newUser.id);

        return newUser;
    }

    return dbUser;
}

async function seedCategories(userId: string) {
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

    console.log(`[Auth] Seeding categories for ${userId}...`);

    // We use upsert to ensure we don't fail if they exist, and the unique constraint
    // @@unique([userId, name, type]) ensures we don't create duplicates.
    for (const cat of defaults) {
        try {
            await prisma.category.upsert({
                where: {
                    userId_name_type: {
                        userId: userId,
                        name: cat.name,
                        type: cat.type
                    }
                },
                update: {}, // Do nothing if exists
                create: {
                    name: cat.name,
                    type: cat.type,
                    color: cat.color,
                    icon: cat.icon,
                    userId: userId
                }
            })
        } catch (error) {
            console.error(`[Auth] Error seeding category ${cat.name}:`, error);
        }
    }
}
