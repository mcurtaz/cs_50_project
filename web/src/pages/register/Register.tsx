import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CircleAlert } from 'lucide-react';

import axios, {AxiosError} from "axios"

import { useEffect, useState, useContext } from "react"
import { Form, useNavigation, useActionData, useNavigate, Link } from "react-router-dom"

import { UserContext } from "@/store/UserContext";

const BASE_URL = import.meta.env.VITE_API_BASEURL;

type RegisterResponse = {
  "message": string
}

type actionReponse = {
  isError: boolean,
  response?: RegisterResponse,
  errors?: string[],
  status: number
}

const Register: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const {user, setUser} = useContext(UserContext);

  const [success, setSuccess] = useState(false);

  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === 'submitting';

  const data = useActionData() as actionReponse;

  useEffect(() => {
    if(!data){
      setErrors([]);
      if(user.isLogged) navigate("/home")
    }else if(data.isError && data.errors){
      setErrors(data.errors);
    }else if(!data.isError && data.response){
      setErrors([]);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 4000)
    }
  }, [data])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-sky-950">
      <div className="w-7/12 border p-4 shadow-lg rounded-lg flex items-stretch bg-white">
        <div className="w-1/2 pr-2">
          <img src="login-illustration.webp" className="w-full rounded"/>
        </div>
        <div className="w-1/2 px-2 flex flex-col justify-between">
          <Form method="post">
            <h1 className="mb-6 text-2xl">Sign up</h1>
            {
              !success && (
                <>
                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" placeholder="Email" required/>
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" placeholder="Password" required/>
                  </div>
                  {errors.length > 0 && 
                    <Alert variant="destructive" className="mb-4">
                      {errors.map((err) => <AlertDescription key={err} className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/>{err}</AlertDescription>)}
                    </Alert>
                  }
                  <Button className="bg-pink-500" type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Sign up"}</Button>
                </>
              )
            }
            {
              success && (
                <Alert className="text-emerald-600">
                  <AlertTitle className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/> Account created successfully!</AlertTitle>
                  <AlertDescription >You can <Link className="text-pink-500 hover:text-pink-900" to="/login"><strong>Log in now.</strong></Link></AlertDescription>
                </Alert>
              )
            }
          </Form>
          <p className="text-sm">Have an account already? <Link className="text-pink-500 hover:text-pink-900" to="/login"><strong>Log in.</strong></Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register

export const submitRegister = async ({request}: {request: Request}) => {
  const formData = await request.formData();

  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }

  let errors: string[] = [];

  try {
    let response = await axios.post<RegisterResponse>(
      BASE_URL + "register", 
      data, 
      {
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': "application/json"
        }
      }
    )

    return {
      isError: false,
      status: 200,
      response: response.data
    }

  } catch (error: unknown | AxiosError) {
    if (axios.isAxiosError(error))  {
      // Access to config, request, and response
      if(error.response?.status == 422 && error.response?.data?.errors?.json){ // validation error
        Object.values(error.response.data.errors.json).forEach(err =>{
          if(Array.isArray(err) && typeof err[0] == "string"){
            errors.push(err[0])
          }
        })
      }else if(error.response?.data?.message){
        errors.push(error.response?.data.message)
      }else{
        errors.push(error.message)
      }
    } else {
      // Just a stock error
      errors.push("Ops, something gone wrong. Please retry later!")
    }

    return {
      isError: true,
      status: axios.isAxiosError(error) ? error.response?.status : 500,
      errors: errors
    }
  }
}
