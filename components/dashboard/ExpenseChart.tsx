"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CategoryIcon } from "@/components/CategoryIcon"

interface CategoryData {
    name: string
    value: number
    color: string
    icon: string
    [key: string]: any
}

interface ExpenseChartProps {
    data: CategoryData[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
    if (data.length === 0) {
        return (
            <Card className="col-span-1 h-[400px] flex items-center justify-center text-gray-500">
                No expense data
            </Card>
        )
    }

    const total = data.reduce((sum, item) => sum + item.value, 0)
    // Sort by value desc
    const sortedData = [...data].sort((a, b) => b.value - a.value)

    return (
        <Card className="col-span-1 border-gray-800 bg-gray-900/50 h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle>Expense Structure</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="h-[250px] w-full shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={4}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Custom Detailed Legend List */}
                <div className="mt-4 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {sortedData.map((item) => {
                        const percent = ((item.value / total) * 100).toFixed(1)
                        return (
                            <div key={item.name} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                                        style={{ backgroundColor: `${item.color}20` }}
                                    >
                                        <CategoryIcon name={item.icon} className="h-4 w-4" style={{ color: item.color }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                                            </div>
                                            <span className="text-xs text-gray-500">{percent}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-300">
                                    ₹{item.value.toLocaleString('en-IN')}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-gray-900 border border-gray-800/50 p-3 rounded-xl shadow-xl">
                <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                    <span className="text-sm font-medium text-gray-300">{data.name}</span>
                </div>
                <div className="text-lg font-bold text-white">
                    ₹{data.value.toLocaleString('en-IN')}
                </div>
            </div>
        )
    }
    return null
}
