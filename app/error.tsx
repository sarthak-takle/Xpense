"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/Button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
            <p className="text-gray-400">{error.message || "An unexpected error occurred."}</p>
            <Button onClick={() => reset()} variant="outline">
                Try again
            </Button>
        </div>
    )
}
