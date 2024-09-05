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

    setTimeout(() => navigate("/login"), 2000)
  }, [])
  
  return (
    <>
      <Alert className="text-emerald-600">
        <AlertTitle className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/> See you soon!</AlertTitle>
        <AlertDescription >You log out correctly</AlertDescription>
      </Alert>
    </>
  )
}

export default Logout
