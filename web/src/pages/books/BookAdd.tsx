import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Book, CircleAlert } from 'lucide-react';

import { verifyToken } from "@/utils/verifyToken"

import axios, {AxiosError} from "axios"

import { useEffect, useState } from "react"
import { Form, useNavigation, useActionData, useNavigate, redirect } from "react-router-dom"

import Rating from "@/components/ui/rating"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

type actionReponse = {
  isError: boolean,
  errors?: string[],
  status: number
}

const BookAdd: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  const navigation = useNavigation();
  const navigate = useNavigate();

  const isSubmitting = navigation.state === 'submitting';

  const data = useActionData() as actionReponse;

  useEffect(() => {
    if(!data){
      setErrors([]);
    }else if(data.isError && data.errors){
      setErrors(data.errors);
    }else if(!data.isError && data.status == 201){
      setSuccess(true);

      setTimeout(() => navigate("/book"), 3000)
    }
  }, [data])

  const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.currentTarget.value;

    setImageUrl(value);
  }
  
  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-center text-3xl font-semibold">ADD NEW BOOK</h1>
      <ScrollArea className="flex-grow pt-4">
        <Form className="flex flex-col items-center justify-center py-4" method="post">
            <img src={imageUrl.length > 0 ? imageUrl : "/book-placeholder.svg"} className="w-48 h-56 object-contain mb-8"/> 
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                <Label htmlFor="image_url">Image</Label>
                <Input type="text" name="image_url" placeholder="Image url" onChange={handleImageUrl}/>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                <Label htmlFor="title">Title</Label>
                <Input type="text" name="title" placeholder="Title" required/>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                <Label htmlFor="author">Author</Label>
                <Input type="text" name="author" placeholder="Author"/>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" placeholder="Description"/>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                <Label htmlFor="status">Status</Label>
                <Select name="status">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TO_READ">To read</SelectItem>
                        <SelectItem value="READING">Reading</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="ABANDONED">Abandoned</SelectItem>
                        <SelectItem value="ON_HOLD">On hold</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                <Label htmlFor="rating">Rating</Label>
                <Input type="hidden" name="rating" value={ratingValue}/>
                <div className="w-40">
                  <Rating size="lg" onClick={(value) => setRatingValue(value)} ratingValue={ratingValue}/>
                </div>
            </div>
            {errors.length > 0 && 
                <Alert variant="destructive" className="mb-4">
                {errors.map((err) => <AlertDescription key={err} className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/>{err}</AlertDescription>)}
                </Alert>
            }
            
            {!success && <Button className="mt-6" type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Add"}</Button>}
            {success && <Alert className="text-emerald-600"><AlertTitle className="flex items-center"><Book className="h-4 w-4 mr-2"/> Book added successfully!</AlertTitle></Alert>}
        </Form>
      </ScrollArea>
    </div> 
  )
}

export default BookAdd

export const submitBookAdd = async ({request}: {request: Request}) => {
  let is_token_valid = await verifyToken();

  if(!is_token_valid){
    return redirect("/logout");
  }

  const access_token = sessionStorage.getItem("access_token");

  const formData = await request.formData();

  const data = {
    image_url: formData.get("image_url"),
    title: formData.get("title"),
    description: formData.get("description"),
    author: formData.get("author"),
    rating: formData.get("rating"),
    status: formData.get("status")
  }

  let errors: string[] = [];

  try {
    let response = await axios.post(
      BASE_URL + "book", 
      data, 
      {
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': "application/json",
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    return {
      isError: false,
      status: 201,
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
      }else if(error.response?.status == 401){ // wrong credentials
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
