import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowDownCircle, ArrowUpCircle, Wallet, Plus, Minus } from "lucide-react"
import Link from "next/link"

interface SummaryProps {
    income: number
    expense: number
    balance: number
    period?: string
    date?: string
}

export function DashboardSummary({ income, expense, balance, period = 'month', date }: SummaryProps) {
    // Format currency
    const format = (val: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val)

    const getLink = (type: string) => {
        const params = new URLSearchParams()
        params.set('type', type)
        if (period) params.set('period', period)
        if (date) params.set('date', date)
        return `/transactions?${params.toString()}`
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Income</CardTitle>
                    <Link href="/add?type=income">
                        <button className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all">
                            <Plus className="h-5 w-5" />
                        </button>
                    </Link>
                </CardHeader>
                <Link href={getLink('income')}>
                    <CardContent className="hover:bg-gray-800/30 transition-colors rounded-b-xl cursor-pointer">
                        <div className="text-2xl font-bold text-green-500">{format(income)}</div>
                        <p className="text-xs text-gray-500 mt-1">Total earnings</p>
                    </CardContent>
                </Link>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Expense</CardTitle>
                    <Link href="/add?type=expense">
                        <button className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                            <Minus className="h-5 w-5" />
                        </button>
                    </Link>
                </CardHeader>
                <Link href={getLink('expense')}>
                    <CardContent className="hover:bg-gray-800/30 transition-colors rounded-b-xl cursor-pointer">
                        <div className="text-2xl font-bold text-red-500">{format(expense)}</div>
                        <p className="text-xs text-gray-500 mt-1">Total spending</p>
                    </CardContent>
                </Link>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Current Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{format(balance)}</div>
                    <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
                </CardContent>
            </Card>
        </div>
    )
}
