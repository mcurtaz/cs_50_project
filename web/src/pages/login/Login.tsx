import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CircleAlert } from 'lucide-react';

import axios, {AxiosError, AxiosResponse} from "axios"

import { useEffect, useState } from "react"
import { Form, useNavigation, useActionData } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

type LoginResponse = {
  "access_token": string,
  "refresh_token": string
}

type actionReponse = {
  isError: boolean,
  response?: AxiosResponse<LoginResponse, any>,
  errors?: string[],
  status: number
}

const Login: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  const data = useActionData() as actionReponse;

  useEffect(() => {
    if(!data){
      setErrors([]);
    }else if(data.isError && data.errors){
      setErrors(data.errors);
    }else if(!data.isError){
      setErrors([]);
      sessionStorage.setItem("access_token", data.response?.data.access_token)
      sessionStorage.setItem("refresh_token", data.response?.data.refresh_token)
      let expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15);
      sessionStorage.setItem("access_token_expiration", expiration.toISOString())
    }
  }, [data])
  
  return (
    <>
      <Form method="post">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" placeholder="Email" required/>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="Password" required/>
        </div>
        {errors.length > 0 && 
          <Alert variant="destructive">
            {errors.map((err) => <AlertDescription key={err} className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/>{err}</AlertDescription>)}
          </Alert>
        }
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Login"}</Button>
      </Form>
    </>
  )
}

export default Login

export const submitLogin = async ({request}: {request: Request}) => {
  const formData = await request.formData();

  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }

  let errors: string[] = [];

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

    return {
      isError: false,
      status: 200,
      response: response
    }

  } catch (error: unknown | AxiosError) {
    console.log(JSON.stringify(error))    
    if (axios.isAxiosError(error))  {
      // Access to config, request, and response
      if(error.response?.status == 422 && error.response?.data?.errors?.json){ // validation error
        Object.values(error.response.data.errors.json).forEach(err =>{
          if(Array.isArray(err) && typeof err[0] == "string"){
            errors.push(err[0])
          }
        })
      }else if(error.response?.status == 401){ // wrong credentials
        errors.push(error.response?.data.message)
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
