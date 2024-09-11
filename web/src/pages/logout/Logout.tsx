import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CircleAlert } from 'lucide-react';

import { useEffect, useContext } from "react"

import { UserContext } from "@/store/UserContext";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const {setUser} = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")
    sessionStorage.removeItem("access_token_expiration")

    setUser({
      isLogged: false, 
      id: null,
      email: null
    })

    setTimeout(() => navigate("/login"), 4000)
  }, [])
  
  return (
    <div className="w-full h-full lg:h-auto lg:w-2/3 2xl:w-2/5 border p-4 lg:shadow-lg lg:rounded-lg flex items-start bg-white">
       <Alert className="text-emerald-600">
        <AlertTitle className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/> See you soon!</AlertTitle>
        <AlertDescription >You log out correctly</AlertDescription>
      </Alert>
    </div>
  )
}

export default Logout
