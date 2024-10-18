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

const Login: React.FC = () => {
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
    <div className="w-full h-full lg:h-auto lg:w-2/3 2xl:w-2/5 border p-4 lg:shadow-lg lg:rounded-lg flex items-stretch bg-white">
      <div className="w-0 md:w-1/2 pr-2 invisible md:visible flex items-center">
        <img src="/login-illustration.webp" className="w-full rounded"/>
      </div>
      <div className="w-full md:w-1/2 px-2 flex flex-col justify-between">
        <Form className="flex flex-col items-center flex-grow justify-center" method="post">
          <h1 className="text-3xl text-pink-600 mb-5">THE ENJOY LIST</h1>
          <h3 className="mb-4 text-xl">LOGIN</h3>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" placeholder="Email" required/>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mb-8">
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" placeholder="Password" required/>
          </div>
          {errors.length > 0 && 
            <Alert variant="destructive" className="mb-4">
              {errors.map((err) => <AlertDescription key={err} className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/>{err}</AlertDescription>)}
            </Alert>
          }
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Login"}</Button>
        </Form>
        <p className="text-sm">Don't have an account yet? <Link className="text-pink-500 hover:text-pink-900" to="/register"><strong>Sign up now for free.</strong></Link></p>
      </div>
    </div>
  )
}

export default Login

export const submitLogin = async ({request}: {request: Request}) => {
  const formData = await request.formData();

  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }

  try {
    let response = await axios.post<LoginResponse>(
      BASE_URL + "login", 
      data, 
      {
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': "application/json"
        }
      }
    )

    return json({
      response: response.data
    }, {status: 200});

  } catch (error: unknown | AxiosError) {
    const errors = getErrorsMessage(error);

    return json({
      errors
    }, {status: 200});
  }
}
