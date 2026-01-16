import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth"
import { DashboardSummary } from "@/components/dashboard/DashboardSummary"
import { ExpenseChart } from "@/components/dashboard/ExpenseChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DashboardFilters } from "@/components/DashboardFilters"
import { UserButton } from "@clerk/nextjs"

async function getData(period: string = 'all', dateString?: string) {
  console.log("--------------- FETCHING DASHBOARD DATA ---------------");
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      console.log("No authenticated user found.")
      return {
        summary: { income: 0, expense: 0, balance: 0 },
        chartData: [],
        recent: []
      }
    }

    const where: any = { userId: user.id }
    const date = dateString ? new Date(dateString) : new Date()

    if (period === 'month') {
      const start = new Date(date.getFullYear(), date.getMonth(), 1)
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
      where.date = { gte: start, lte: end }
    } else if (period === 'year') {
      const start = new Date(date.getFullYear(), 0, 1)
      const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)
      where.date = { gte: start, lte: end }
    } else if (period === 'week') {
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust to Monday
      const start = new Date(date)
      start.setDate(diff)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      where.date = { gte: start, lte: end }
    }

    // Fetch transactions for Chart & Summary based on filtered date
    const filteredTransactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { category: true }
    })

    // Calculate totals from filtered data
    let totalIncome = 0
    let totalExpense = 0
    const expenseByCategory: Record<string, { name: string, value: number, color: string, icon: string }> = {}

    for (const t of filteredTransactions) {
      if (t.type === 'income') totalIncome += t.amount
      else {
        totalExpense += t.amount
        if (!expenseByCategory[t.category.name]) {
          expenseByCategory[t.category.name] = {
            name: t.category.name,
            value: 0,
            color: t.category.color,
            icon: t.category.icon
          }
        }
        expenseByCategory[t.category.name].value += t.amount
      }
    }

    // Balance matching the time period (Net Flow)
    const balance = totalIncome - totalExpense

    return {
      summary: { income: totalIncome, expense: totalExpense, balance }, // Balance is all time
      chartData: Object.values(expenseByCategory),
      // Recent transactions: also filtered by period seems appropriate for "Weekly View" dashboard
      recent: filteredTransactions.slice(0, 5)
    }
  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error)
    return {
      summary: { income: 0, expense: 0, balance: 0 },
      chartData: [],
      recent: []
    }
  }
}

interface PageProps {
  searchParams: Promise<{ period?: string; date?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const period = params.period || 'month'
  const date = params.date
  const data = await getData(period, date)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="md:hidden">
            <UserButton />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center w-full md:w-auto">
          <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <DashboardFilters />
          </div>
          <Link href="/add" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </Link>
        </div>
      </div>

      <DashboardSummary
        income={data.summary.income}
        expense={data.summary.expense}
        balance={data.summary.balance}
        period={period}
        date={date}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ExpenseChart data={data.chartData} />
        <RecentTransactions transactions={data.recent} />
      </div>
    </div>
  )
}
