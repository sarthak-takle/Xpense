"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function TransactionFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentFilter = searchParams.get('filter') || 'all'

    const setFilter = (filter: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (filter === 'all') {
            params.delete('filter')
        } else {
            params.set('filter', filter)
        }
        router.push(`/transactions?${params.toString()}`)
    }

    return (
        <div className="bg-gray-900 rounded-lg p-1 flex space-x-1">
            {['all', 'month', 'year'].map((filter) => (
                <button
                    key={filter}
                    onClick={() => setFilter(filter)}
                    className={cn(
                        "px-3 py-1 text-xs rounded capitalize transition-colors",
                        currentFilter === filter
                            ? "bg-gray-800 text-white font-medium"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    {filter === 'all' ? 'All Time' : `This ${filter}`}
                </button>
            ))}
        </div>
    )
}
