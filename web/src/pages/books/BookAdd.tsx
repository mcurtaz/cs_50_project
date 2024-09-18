import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';

import { verifyToken } from "@/utils/verifyToken"
import getErrorsMessage from "@/utils/getErrorsMessage";

import axios, {AxiosError} from "axios"
import {useNavigate, redirect, json } from "react-router-dom"

import BookForm from "@/components/book/BookForm"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

const BookAdd: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center">
        <Button size={"sm_icon"} onClick={()=> navigate("/book")}>
          <ArrowLeft size={22} />
        </Button>
        {/* <Link className="absolute text-pink-500 hover:text-pink-900" to="/book">
          <ChevronLeft size={32} />
        </Link> */}
        <h1 className="flex-grow text-center text-3xl font-semibold">ADD NEW BOOK</h1>
      </div>
      <BookForm 
        book={null} 
        options={{
          redirect: "/book", 
          success_message: "Book added successfully", 
          button_label : "Add book",
          method: "post"
        }}
      />
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

    return json({response: response.data },{status: 201})

  } catch (error: unknown | AxiosError) {
    const errors = getErrorsMessage(error);

    return json({
      errors
    }, {status: 200});
  }
}
