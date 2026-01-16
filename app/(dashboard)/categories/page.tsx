import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { CategoryItem } from "@/components/CategoryItem"
import { getAuthenticatedUser } from "@/lib/auth"

async function getData() {
    const user = await getAuthenticatedUser()
    if (!user) return []

    return await prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { name: 'asc' }
    })
}

export default async function CategoriesPage() {
    const categories = await getData()

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link href="/categories/new">
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <CategoryItem key={cat.id} category={cat} />
                ))}
            </div>
        </div >
    )
}
