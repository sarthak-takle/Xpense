"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"

export default function NewCategoryPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [type, setType] = useState("expense")
    const [color, setColor] = useState("#ef4444")
    const [loading, setLoading] = useState(false)

    const colors = [
        "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981",
        "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#64748b"
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return
        setLoading(true)

        try {
            await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, color, icon: 'Circle' })
            })
            router.refresh()
            router.push('/categories')
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-6">Create Category</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Type Selection */}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={cn(
                            "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                            type === 'expense' ? "bg-red-500 text-white border-red-500" : "border-gray-700 text-gray-400"
                        )}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={cn(
                            "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                            type === 'income' ? "bg-green-500 text-white border-green-500" : "border-gray-700 text-gray-400"
                        )}
                    >
                        Income
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Category Name</label>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Groceries"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Color</label>
                    <div className="grid grid-cols-6 gap-2">
                        {colors.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={cn(
                                    "w-10 h-10 rounded-full transition-transform",
                                    color === c ? "scale-110 ring-2 ring-white" : "hover:scale-105"
                                )}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={!name}
                        isLoading={loading}
                    >
                        Create Category
                    </Button>
                </div>

            </form>
        </div>
    )
}
