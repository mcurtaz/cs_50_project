import { useState } from "react";
import { redirect, json, useNavigate, useLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

import axios, {AxiosError} from "axios"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

import { verifyToken } from "@/utils/verifyToken";
import { Movie } from "@/models/movie.model";
import { Pagination as PaginationModel } from "@/models/pagination.model";

import getErrorsMessage from "@/utils/getErrorsMessage";

import MovieCard from "@/components/movie/MovieCard";
import MovieDeleteModal from "@/components/movie/MovieDeleteModal";
import Pagination from "@/components/navigation/Pagination";
import MovieFilters from "@/components/movie/MovieFilters";

type MovieListResponse = {
  pagination: PaginationModel,
  movies: Movie[]
}
const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const {movies, pagination} = useLoaderData() as MovieListResponse;

  const [toDelete, setToDelete] = useState<null | Movie>(null);
  
  return (
    <div className="w-full h-full flex flex-col px-6 pt-6 pb-3">
      <h1 className="text-center text-3xl font-semibold">MOVIES</h1>
      <div className="flex flex-row items-center justify-center">
        <MovieFilters />
      </div>
      <div className="w-full flex-grow relative overflow-hidden">
        <ScrollArea className="w-full h-full">
          <div className="p-6 gap-10 flex flex-row flex-wrap">
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} setToDelete={setToDelete} />)}
          </div>
        </ScrollArea>
        <div className="absolute bottom-4 right-4">
          <Button onClick={()=> {navigate("/movie/add")}} size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <Pagination pagination={pagination}/>
      </div>
      <MovieDeleteModal toDelete={toDelete} setToDelete={setToDelete}/>
    </div>
  )
}

export default MovieList;

let abortController: AbortController;

export const fetchMovieList = async ({ request }: {request: Request}) =>{
  let is_token_valid = await verifyToken();

  if(!is_token_valid){
    return redirect("/logout");
  }

  const access_token = sessionStorage.getItem("access_token");

  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  try {
    let response = await axios.get<MovieListResponse>(
      BASE_URL + "movie" + "?" + searchParams.toString(), 
      {
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin': '*',
          'Accept': "application/json",
          'Authorization': 'Bearer ' + access_token
        },
        signal: abortController.signal
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
