"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { CategoryIcon } from "@/components/CategoryIcon"
import Link from "next/link"

interface Transaction {
    id: string
    amount: number
    type: string
    date: Date
    note: string | null
    category: {
        name: string
        color: string
        icon: string
    }
}

// Group transactions by Date string (e.g. "Today", "Yesterday", "12 Jan 2025")
function groupTransactions(transactions: Transaction[]) {
    const groups: Record<string, Transaction[]> = {}

    transactions.forEach(t => {
        const d = new Date(t.date)
        const key = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
        if (!groups[key]) groups[key] = []
        groups[key].push(t)
    })

    return groups
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    if (transactions.length === 0) {
        return <div className="text-center text-gray-500 mt-10">No transactions found</div>
    }

    const groups = groupTransactions(transactions)
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    // Sorting strings isn't accurate for date. 
    // Better: We rely on input transactions being sorted by date DESC already.
    // Then we iterate keys in insertion order is safer if we build Map, or just re-sort based on first item date.
    // Object keys order is complex.
    // Let's use array of entries.

    const groupedArray = Object.entries(groups).sort((a, b) => {
        // Take first item date
        return new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime()
    })

    return (
        <div className="space-y-6 pb-24">
            {groupedArray.map(([date, items]) => (
                <div key={date}>
                    <h3 className="text-sm text-gray-400 mb-2 font-medium sticky top-0 bg-gray-950 py-2">{date}</h3>
                    <Card className="border-gray-800 bg-gray-900/50">
                        <CardContent className="p-0">
                            {items.map((t, i) => (
                                <Link
                                    key={t.id}
                                    href={`/transactions/${t.id}/edit`}
                                    className={`flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${i !== items.length - 1 ? 'border-b border-gray-800' : ''}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: t.category.color }}
                                        >
                                            <CategoryIcon name={t.category.icon} className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{t.category.name}</p>
                                            {t.note && <p className="text-xs text-gray-500">{t.note}</p>}
                                        </div>
                                    </div>
                                    <div className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'} ₹{t.amount}
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}
