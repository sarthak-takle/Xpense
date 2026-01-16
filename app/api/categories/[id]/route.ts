import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // Optional: Check if used in transactions? 
        // For now, let's allow delete. Prisma might throw if restricted, or cascade.
        // Assuming we want to allow delete.

        await prisma.category.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting category:", error)
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }
}
