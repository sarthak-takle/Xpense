"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function NewAccountPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [type, setType] = useState("Cash")
    const [balance, setBalance] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !balance) return
        setLoading(true)

        try {
            await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, balance: parseFloat(balance), currency: 'INR' })
            })
            router.refresh()
            router.push('/settings/accounts')
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-6">Add Account</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Account Name</label>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. HDFC Bank"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Account Type</label>
                    <div className="flex space-x-2">
                        {['Cash', 'Bank', 'Wallet'].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${type === t ? 'bg-green-500 text-white border-green-500' : 'border-gray-700 text-gray-400'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Initial Balance</label>
                    <Input
                        type="text"
                        inputMode="decimal"
                        value={balance}
                        onChange={e => {
                            const val = e.target.value
                            if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) {
                                setBalance(val)
                            }
                        }}
                        placeholder="0"
                    />
                </div>

                <Button className="w-full" size="lg" disabled={!name} isLoading={loading}>
                    Create Account
                </Button>

            </form>
        </div>
    )
}
