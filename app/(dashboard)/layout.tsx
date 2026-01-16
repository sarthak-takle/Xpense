import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
            <Sidebar />

            <main className="flex-1 w-full overflow-y-auto overflow-x-hidden md:pl-64 relative pb-20 md:pb-0">
                {/* Wrapper for max width */}
                <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 min-h-full">
                    {children}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
