"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 border-8 border-red-900">
            {/* Using hash routing to avoid path issues */}
            <SignIn routing="hash" />
        </div>
    );
}
