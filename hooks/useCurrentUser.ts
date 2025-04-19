import { useSession } from "@/lib/auth-client"

export const useCurrentUser = () => {
    const { data: session } = useSession()

    return session?.user
}    
