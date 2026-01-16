"use client"

import { CategoryIcon } from "@/components/CategoryIcon"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CategoryItemProps {
    category: {
        id: string
        name: string
        color: string
        icon: string
        type: string
    }
}

export function CategoryItem({ category }: CategoryItemProps) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure? This might act weird if transactions use it.")) return
        setDeleting(true)
        try {
            await fetch(`/api/categories/${category.id}`, { method: 'DELETE' })
            router.refresh()
        } catch (error) {
            console.error(error)
            setDeleting(false)
        }
    }

    return (
        <div className={cn(
            "bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center space-y-3 relative group transition-all hover:bg-gray-800",
            deleting && "opacity-50 pointer-events-none"
        )}>
            <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Category"
            >
                <Trash2 size={16} />
            </button>
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
                <CategoryIcon name={category.icon} className="h-6 w-6" />
            </div>
            <div className="text-center">
                <p className="font-medium text-white">{category.name}</p>
                <p className="text-xs text-gray-400 capitalize">{category.type}</p>
            </div>
        </div>
    )
}
