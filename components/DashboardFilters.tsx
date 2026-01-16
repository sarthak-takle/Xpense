"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function DashboardFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPeriod = searchParams.get('period') || 'month' // Default to month for better UX
    const dateParam = searchParams.get('date')
    const currentDate = dateParam ? new Date(dateParam) : new Date()

    const setPeriod = (period: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (period === 'all') {
            params.delete('period')
            params.delete('date')
        } else {
            params.set('period', period)
            // Reset to today when switching periods to avoid confusion, or keep current date?
            // Keeping current date is usually better but might need adjustment (e.g. switching from specific week to month).
            // Let's keep it simple: sync with today if switching types, OR keep current anchor.
            // Let's keep current anchor date.
            if (!dateParam) params.set('date', new Date().toISOString())
        }
        router.push(`/?${params.toString()}`)
    }

    const navigate = (direction: number) => {
        const newDate = new Date(currentDate)
        if (currentPeriod === 'month') {
            newDate.setMonth(newDate.getMonth() + direction)
        } else if (currentPeriod === 'year') {
            newDate.setFullYear(newDate.getFullYear() + direction)
        } else if (currentPeriod === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7))
        }

        const params = new URLSearchParams(searchParams.toString())
        params.set('date', newDate.toISOString())
        // Ensure period is set
        if (!params.get('period')) params.set('period', 'month')

        router.push(`/?${params.toString()}`)
    }

    const formatLabel = () => {
        if (currentPeriod === 'all') return 'All Time'

        const options: Intl.DateTimeFormatOptions = {}
        if (currentPeriod === 'month') {
            return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(currentDate)
        } else if (currentPeriod === 'year') {
            return new Intl.DateTimeFormat('en-IN', { year: 'numeric' }).format(currentDate)
        } else if (currentPeriod === 'week') {
            // Get start and end of week
            const start = new Date(currentDate)
            const day = start.getDay()
            const diff = start.getDate() - day + (day === 0 ? -6 : 1)
            start.setDate(diff)

            const end = new Date(start)
            end.setDate(start.getDate() + 6)

            const dp = { month: 'short', day: 'numeric' } as const
            return `${new Intl.DateTimeFormat('en-IN', dp).format(start)} - ${new Intl.DateTimeFormat('en-IN', dp).format(end)}`
        }
    }

    return (
        <div className="flex bg-gray-900 rounded-lg p-1 items-center space-x-2">
            {/* Period Selector */}
            <div className="flex space-x-1 bg-gray-950/50 rounded p-1">
                {['all', 'week', 'month', 'year'].map((period) => (
                    <button
                        key={period}
                        onClick={() => setPeriod(period)}
                        className={cn(
                            "px-3 py-1 text-xs rounded capitalize transition-colors",
                            currentPeriod === period
                                ? "bg-gray-800 text-white font-medium shadow-sm"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        {period === 'all' ? 'All' : period}
                    </button>
                ))}
            </div>

            {/* Navigation Controls (Visible only if not 'all') */}
            {currentPeriod !== 'all' && (
                <div className="flex items-center space-x-2 px-2 border-l border-gray-800">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium min-w-[100px] text-center">{formatLabel()}</span>
                    <button onClick={() => navigate(1)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
