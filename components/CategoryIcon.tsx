import { Icons, IconName } from "./Icons"
import { LucideProps } from "lucide-react"

interface CategoryIconProps extends LucideProps {
    name: string
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
    // Default to Circle if not found
    const Icon = Icons[name as IconName] || Icons.Circle
    return <Icon {...props} />
}
