import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import axios, {AxiosError} from "axios"

import { useState } from "react"

const BASE_URL = import.meta.env.VITE_SERVER_BASEURL;

type RegisterResponse = {
  "access_token": string,
  "refresh_token": string
}

const Register: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState<string[]>([]);

  const handleForm = (e: React.FormEvent<HTMLInputElement>) =>{
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;
    
    setForm(prev => {
      return {...prev, [name]: value}
    })
  }
  
  const submitRegister = async () => {
    try {
      let response = await axios.post<RegisterResponse>(
        BASE_URL + "register", 
        form, 
        {
          headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': "application/json"
          }
        }
      )

    } catch (error: unknown | AxiosError) {
      if (axios.isAxiosError(error))  {
        // Access to config, request, and response
        if(error.response?.status == 422 && error.response?.data?.errors?.json){ // validation error
          let error_list: string[] = [];

          Object.values(error.response.data.errors.json).forEach(err =>{
            if(Array.isArray(err) && typeof err[0] == "string"){
              error_list.push(err[0])
            }
          })

          setErrors(error_list)
        }else if(error.status == 401){ // wrong credentials
          setErrors([error.message])
        }
      } else {
        // Just a stock error
        setErrors(["Ops, something gone wrong. Please retry later!"])
      }
    }
  }

  return (
    <>
      <form>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" onChange={handleForm} value={form.email} name="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input type="password" onChange={handleForm} value={form.password} name="password" id="password" placeholder="Password" />
        </div>
        <Button type="button" onClick={submitRegister}>Register</Button>
      </form>
    </>
  )
}

export default Register
