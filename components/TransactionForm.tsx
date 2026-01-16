"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
// import { CalendarIcon } from "lucide-react"
import { CategoryIcon } from "@/components/CategoryIcon"
import { Trash2 } from "lucide-react"

interface Category {
    id: string
    name: string
    icon: string
    color: string
    type: string // Added type definition
}

interface Account {
    id: string
    name: string
    type: string
}

// Update Props Interface
interface TransactionFormProps {
    categories: Category[]
    accounts: Account[]
    initialData?: {
        id: string
        amount: number
        type: string
        date: string | Date
        note: string | null
        categoryId: string
        accountId: string
    }
}

export function TransactionForm({ categories, accounts, initialData }: TransactionFormProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize State with initialData if present
    const defaultType = initialData?.type as "expense" | "income" || (searchParams.get('type') === 'income' ? 'income' : 'expense')

    const [type, setType] = useState<"expense" | "income">(defaultType)
    const [amount, setAmount] = useState(initialData?.amount.toString() || "")
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "")
    const [accountId, setAccountId] = useState(initialData?.accountId || accounts[0]?.id || "")
    const [note, setNote] = useState(initialData?.note || "")

    // Handle Date: initialData.date might be Date object or ISO string.
    // We need YYYY-MM-DD for input type="date"
    const formatDateForInput = (d: string | Date | undefined) => {
        if (!d) return new Date().toISOString().split('T')[0]
        const dateObj = typeof d === 'string' ? new Date(d) : d
        return dateObj.toISOString().split('T')[0]
    }

    const [date, setDate] = useState(formatDateForInput(initialData?.date))
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !categoryId || !accountId) return
        setLoading(true)

        try {
            const url = isEditMode ? `/api/transactions/${initialData.id}` : '/api/transactions'
            const method = isEditMode ? 'PUT' : 'POST'

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type,
                    categoryId,
                    accountId,
                    note,
                    date: new Date(date).toISOString()
                })
            })
            router.refresh()
            router.push('/')
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this transaction?")) return
        setLoading(true)
        try {
            await fetch(`/api/transactions/${initialData?.id}`, {
                method: 'DELETE',
            })
            router.refresh()
            router.push('/')
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    // Filter categories logic remains same...
    const filteredCategories = (categories as any[]).filter(c => c.type === type || c.type === 'any')

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4">

            {/* Type Toggle */}
            <div className="flex rounded-lg bg-gray-900 p-1">
                <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={cn(
                        "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
                        type === "expense" ? "bg-red-500/20 text-red-500" : "text-gray-400 hover:text-gray-200"
                    )}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => setType("income")}
                    className={cn(
                        "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
                        type === "income" ? "bg-green-500/20 text-green-500" : "text-gray-400 hover:text-gray-200"
                    )}
                >
                    Income
                </button>
            </div>

            {/* Amount Display Input */}
            <div className={cn(
                "relative flex items-center justify-center h-16 rounded-2xl transition-colors",
                type === "expense" ? "bg-red-500/10" : "bg-green-500/10"
            )}>
                <span className={cn("text-2xl font-bold mr-1", type === 'expense' ? "text-red-500" : "text-green-500")}>₹</span>
                <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={e => {
                        const val = e.target.value
                        if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) {
                            setAmount(val)
                        }
                    }}
                    placeholder="0"
                    className={cn(
                        "bg-transparent text-4xl font-bold outline-none text-center w-48",
                        type === 'expense' ? "text-red-500 placeholder:text-red-500/30" : "text-green-500 placeholder:text-green-500/30"
                    )}
                    autoFocus
                />
            </div>

            {/* Account Selector */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {accounts.map(acc => (
                    <button
                        key={acc.id}
                        type="button"
                        onClick={() => setAccountId(acc.id)}
                        className={cn(
                            "px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors",
                            accountId === acc.id
                                ? "bg-gray-100 text-black border-gray-100" // Active: Light
                                : "border-gray-700 text-gray-400 hover:border-gray-500"
                        )}
                    >
                        {acc.name}
                    </button>
                ))}
            </div>

            {/* Category Grid */}
            <div id="category-grid" className="grid grid-cols-4 gap-4 flex-1 content-start overflow-y-auto min-h-[100px] mb-4">
                {filteredCategories.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className="flex flex-col items-center space-y-2 group"
                    >
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                            categoryId === cat.id
                                ? "bg-white text-black scale-110 shadow-lg shadow-white/10" // High contrast active state
                                : "bg-gray-900 group-hover:bg-gray-800 text-gray-400"
                        )}
                        >
                            <CategoryIcon name={cat.icon} className="h-6 w-6" />
                        </div>
                        <span className={cn("text-xs truncate w-full text-center font-medium", categoryId === cat.id ? "text-white" : "text-gray-500")}>
                            {cat.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Date Selection & Footer */}
            <div className="mt-auto pt-2 space-y-2">
                <div className="flex space-x-3">
                    <div className="relative flex-1">
                        <Input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="bg-gray-900 border-transparent focus:border-gray-700 rounded-xl h-10 text-center text-sm"
                        />
                    </div>
                    <Input
                        placeholder="Add a note..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="bg-gray-900 border-transparent focus:border-gray-700 flex-[1.5] rounded-xl h-10 text-sm"
                    />
                </div>

                <div className="flex items-center space-x-3">
                    {isEditMode && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            variant="destructive"
                            className="h-12 w-12 rounded-xl flex items-center justify-center bg-gray-900 hover:bg-red-900/50 text-red-500 border border-gray-800"
                            isLoading={loading}
                        >
                            <Trash2 size={20} />
                        </Button>
                    )}
                    <Button
                        className={cn(
                            "h-12 text-base font-bold rounded-xl flex-1 shadow-lg transition-transform active:scale-[0.98]",
                            type === 'expense'
                                ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/20"
                                : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-500/20"
                        )}
                        isLoading={loading}
                        disabled={!amount || !categoryId}
                    >
                        {isEditMode ? 'Update' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
                    </Button>
                </div>
            </div>
        </form>
    )
}
