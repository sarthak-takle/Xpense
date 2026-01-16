import { prisma } from "@/lib/prisma"
import { TransactionForm } from "@/components/TransactionForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAuthenticatedUser } from "@/lib/auth"
import { redirect } from "next/navigation"

interface EditTransactionPageProps {
    params: Promise<{ id: string }>
}

async function getData(id: string) {
    const user = await getAuthenticatedUser()
    if (!user) return redirect('/sign-in')

    const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { category: true, account: true }
    })

    if (!transaction || transaction.userId !== user.id) return null

    const categories = await prisma.category.findMany({ where: { userId: user.id } })
    const accounts = await prisma.account.findMany({ where: { userId: user.id } })

    return { transaction, categories, accounts }
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
    const { id } = await params
    const data = await getData(id)

    if (!data) {
        return <div className="p-8 text-center text-gray-500">Transaction not found</div>
    }

    return (
        <div className="max-w-md mx-auto h-[calc(100vh-85px)] flex flex-col overflow-hidden">
            <div className="flex items-center mb-2 flex-shrink-0">
                <Link href="/transactions" className="mr-3 p-1.5 -ml-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold">Edit Transaction</h1>
            </div>

            <div className="flex-1 min-h-0">
                <TransactionForm
                    categories={data.categories}
                    accounts={data.accounts}
                    initialData={data.transaction}
                />
            </div>
        </div>
    )
}
