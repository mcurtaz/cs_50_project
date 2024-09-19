import { useState } from "react";
import { redirect, json, useNavigate, useLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

import axios, {AxiosError} from "axios"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

import { verifyToken } from "@/utils/verifyToken";
import { Book } from "@/models/book.model";

import getErrorsMessage from "@/utils/getErrorsMessage";

import BookCard from "@/components/book/BookCard";
import BookDeleteModal from "@/components/book/BookDeleteModal";

type BookListResponse = Book[]

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const books = useLoaderData() as BookListResponse;

  const [toDelete, setToDelete] = useState<null | Book>(null);
  
  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-center text-3xl font-semibold">BOOKS</h1>
      <div className="w-full flex-grow relative overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-10">
            {books.map(book => <BookCard key={book.id} book={book} setToDelete={setToDelete} />)}
          </div>
        </ScrollArea>
        <div className="absolute bottom-4 right-4">
          <Button onClick={()=> {navigate("/book/add")}} size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <BookDeleteModal toDelete={toDelete} setToDelete={setToDelete}/>
    </div>
  )
}

export default BookList;

export const fetchBookList = async () =>{
  let is_token_valid = await verifyToken();

  if(!is_token_valid){
    return redirect("/logout");
  }

  const access_token = sessionStorage.getItem("access_token");

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
    const errors = getErrorsMessage(error);

    throw json({
      errors: errors, 
      message: errors[0]
    }, { 
      status: axios.isAxiosError(error) ? error.response?.status : 500
    });
  }
}
