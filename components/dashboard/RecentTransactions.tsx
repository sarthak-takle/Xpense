import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { CategoryIcon } from "@/components/CategoryIcon"
import Link from "next/link"
// import { Transaction, Category } from "@prisma/client" 
// We can't import types from prisma client in component if edge runtime, but here it's fine.
// Actually receiving POJO is safer.

interface TransactionWithCategory {
    id: string
    amount: number
    type: string
    date: Date
    note: string | null
    category: {
        name: string
        icon: string
        color: string
    }
}

interface RecentTransactionsProps {
    transactions: TransactionWithCategory[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(date))
    }

    return (
        <Card className="col-span-1 md:col-span-2 border-gray-800 bg-gray-900/50">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No recent transactions</p>
                    )}

                    {transactions.map((t) => (
                        <Link
                            key={t.id}
                            href={`/transactions/${t.id}/edit`}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                    style={{ backgroundColor: `${t.category.color}20`, color: t.category.color }}
                                >
                                    <CategoryIcon name={t.category.icon} className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{t.category.name}</p>
                                    <p className="text-xs text-gray-400">{t.note || formatDate(t.date)}</p>
                                </div>
                            </div>
                            <div className={`text-sm font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                {t.type === 'income' ? '+' : '-'} ₹{t.amount}
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card >
    )
}
