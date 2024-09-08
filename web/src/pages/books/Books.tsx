import { verifyToken } from "@/utils/verifyToken";

import axios, {AxiosError} from "axios"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

import { Book } from "@/models/book.model";
import { redirect, json } from "react-router-dom";

type BookListResponse = Book[]

const Books: React.FC = () => {

  return (
    <>
      <h1>BOOKS</h1>
    </>
  )
}

export default Books;

export const fetchBooks = async () =>{
  let is_token_valid = await verifyToken();

  if(!is_token_valid){
    return redirect("/logout");
  }

  const access_token = sessionStorage.getItem("access_token");

  let errors: string[] = [];

  try {
    let response = await axios.get<BookListResponse>(
      BASE_URL + "book", 
      {
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': "application/json",
          'Authorization': 'Bearer ' + access_token
        }
      }
    )

    return json(response.data, { status: 200 });

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
      }
    } else {
      // Just a stock error
      errors.push("Ops, something gone wrong. Please retry later!")
    }

    return json({errors}, { status: axios.isAxiosError(error) ? error.response?.status : 500 });
  }
}
