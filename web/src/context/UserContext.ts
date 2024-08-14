import { createContext } from "react"

interface UserContextType {
    isLogged: boolean;
    email?: string;
}

export const UserContext = createContext<UserContextType>({
    isLogged: false
});