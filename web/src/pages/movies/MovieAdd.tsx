import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';

import { verifyToken } from "@/utils/verifyToken"
import getErrorsMessage from "@/utils/getErrorsMessage";

import axios, {AxiosError} from "axios"
import {useNavigate, redirect, json } from "react-router-dom"

import MovieForm from "@/components/movie/MovieForm";

const BASE_URL = import.meta.env.VITE_API_BASEURL;

const MovieAdd: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-center">
        <Button size={"sm_icon"} onClick={()=> navigate(-1)}>
          <ArrowLeft size={22} />
        </Button>
        {/* <Link className="absolute text-pink-500 hover:text-pink-900" to="/movie">
          <ChevronLeft size={32} />
        </Link> */}
        <h1 className="flex-grow text-center text-3xl font-semibold">ADD NEW MOVIE</h1>
      </div>
      <MovieForm 
        movie={null} 
        options={{
          redirect: "/movie", 
          success_message: "Movie added successfully", 
          button_label : "Add movie",
          method: "post"
        }}
      />
    </div> 
  )
}

export default MovieAdd

export const submitMovieAdd = async ({request}: {request: Request}) => {
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
    rating: formData.get("rating"),
    status: formData.get("status")
  }

  try {
    let response = await axios.post(
      BASE_URL + "movie", 
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
