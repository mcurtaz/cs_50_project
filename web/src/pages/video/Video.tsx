import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { CircleAlert } from 'lucide-react';

import axios, {AxiosError} from "axios"

import { useEffect, useState, useContext } from "react"
import { Form, useNavigation, useActionData, useNavigate, Link, json } from "react-router-dom"

import { UserContext } from "@/store/UserContext";
import getErrorsMessage from "@/utils/getErrorsMessage";

const BASE_URL = import.meta.env.VITE_API_BASEURL;

type LoginResponse = {
  "access_token": string,
  "refresh_token": string,
  "user": {
    "id": number,
    "email": string
  }
}

type actionReponse = {
  response?: LoginResponse,
  errors?: string[]
}

const Video: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const {user, setUser} = useContext(UserContext);

  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === 'submitting';

  const data = useActionData() as actionReponse;

  useEffect(() => {
    if(!data){
      setErrors([]);
      if(user.isLogged) navigate("/home")
    }else if(data && data.errors){
      setErrors(data.errors);
    }else if(data.response){
      setErrors([]);
      sessionStorage.setItem("access_token", data.response?.access_token)
      sessionStorage.setItem("refresh_token", data.response?.refresh_token)
      let expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15);
      sessionStorage.setItem("access_token_expiration", expiration.toISOString())

      setUser({
        isLogged: true, 
        id: data.response.user.id,
        email: data.response.user.email
      })

      navigate("/home");
    }
  }, [data])
  
  return (
    <div className="w-full h-full lg:h-auto lg:w-2/3 2xl:w-2/5 border p-4 lg:shadow-lg lg:rounded-lg flex flex-col items-center bg-white">
        <h1 className="text-3xl text-pink-600 mb-5 font-semibold">THE ENJOY LIST</h1>
        <h3 className="text-2xl">Curtaz Michele</h3>
        <small className="text-lg mt-2">Carvico (BG) ITALY</small>

        <h5 className="mt-5"><strong>GitHub:</strong> https://github.com/mcurtaz/cs_50_project</h5>
        <p className="mt-2">2024-10-19</p>
        <Button className="mt-8" onClick={()=>navigate("/login")}>Continue</Button>
    </div>
  )
}

export default Video