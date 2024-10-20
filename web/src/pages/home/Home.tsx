import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@radix-ui/react-label";
import { Link } from "react-router-dom";

import { redirect, json, useNavigate, useLoaderData } from "react-router-dom";
import { verifyToken } from "@/utils/verifyToken";
import axios, {AxiosError} from "axios"

import { Movie as MovieModel} from "@/models/movie.model";
import { Book as BookModel } from "@/models/book.model";
import { Series as SeriesModel } from "@/models/series.model";

import BookCard from "@/components/book/BookCard";
import MovieCard from "@/components/movie/MovieCard";
import SeriesCard from "@/components/series/SeriesCard";
import BookDeleteModal from "@/components/book/BookDeleteModal";
import MovieDeleteModal from "@/components/movie/MovieDeleteModal";
import SeriesDeleteModal from "@/components/series/SeriesDeleteModal";

type BookDashboardResponse = BookModel[]
type MovieDashboardResponse = MovieModel[]
type SeriesDashboardResponse = SeriesModel[]

type DashboardData = {
  books: BookDashboardResponse,
  movies: MovieDashboardResponse,
  series: SeriesDashboardResponse
}

const BASE_URL = import.meta.env.VITE_API_BASEURL;

const Home: React.FC = () => {
  const {movies, books, series} = useLoaderData() as DashboardData;
  const [bookToDelete, setBookToDelete] = useState<null | BookModel>(null);
  const [movieToDelete, setMovieToDelete] = useState<null | MovieModel>(null);
  const [seriesToDelete, setSeriesToDelete] = useState<null | SeriesModel>(null);

  return (
    <>
       <div className="w-full h-full flex flex-col px-6 pt-6 pb-3">
        <h1 className="text-center text-4xl text-pink-600 font-semibold">THE ENJOY LIST</h1>
        <div className="w-full flex-grow py-10 overflow-hidden">
          <ScrollArea className="w-full h-full">
            <div className="pb-10">
              <div className="flex flex-row items-center justify-between p-2">
                <Label className="font-bold text-xl">BOOKS</Label>
                <Link className="text-pink-600 mr-1" to={"/book"}>See all</Link>
              </div>
              <div className="min-h-20 flex flex-row gap-x-10 w-full">
                {books.length === 0 && <p className="mt-3">No book found. <Link className="text-pink-500 hover:text-pink-900" to="/book/add">Add your first book.</Link></p>}
                {books.map(book => <BookCard key={book.id} book={book} setToDelete={setBookToDelete} />)}
              </div>
            </div>
            <div className="pb-10">
              <div className="flex flex-row items-center justify-between p-2">
                <Label className="font-bold text-xl">MOVIES</Label>
                <Link className="text-pink-600 mr-1" to={"/movie"}>See all</Link>
              </div>
              <div className="min-h-20 flex flex-row gap-x-10">
                {movies.length === 0 && <p className="mt-3">No movie found. <Link className="text-pink-500 hover:text-pink-900" to="/movie/add">Add your first movie.</Link></p>}
                {movies.map(movie => <MovieCard key={movie.id} movie={movie} setToDelete={setMovieToDelete} />)}
              </div>
            </div>
            <div className="pb-10">
              <div className="flex flex-row items-center justify-between p-2">
                <Label className="font-bold text-xl">SERIES</Label>
                <Link className="text-pink-600 mr-1" to={"/series"}>See all</Link>
              </div>
              <div className="min-h-20">
                <div className="min-h-20 flex flex-row gap-x-10">
                  {series.length === 0 && <p className="mt-3">No series found. <Link className="text-pink-500 hover:text-pink-900" to="/series/add">Add your first series.</Link></p>}
                  {series.map(item => <SeriesCard key={item.id} series={item} setToDelete={setSeriesToDelete} />)}
                </div>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <BookDeleteModal toDelete={bookToDelete} setToDelete={setBookToDelete}/>
      <MovieDeleteModal toDelete={movieToDelete} setToDelete={setMovieToDelete}/>
      <SeriesDeleteModal toDelete={seriesToDelete} setToDelete={setSeriesToDelete}/>
    </>
   
  )
}

export default Home

let abortController: AbortController;

export const fetchDashboard = async () =>{
  let is_token_valid = await verifyToken();

  if(!is_token_valid){
    return redirect("/logout");
  }

  const access_token = sessionStorage.getItem("access_token");

  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  

  let response_books = axios.get<BookDashboardResponse>(
    BASE_URL + "book/dashboard", 
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

  let response_movie = axios.get<MovieDashboardResponse>(
    BASE_URL + "movie/dashboard", 
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

  let response_series = axios.get<SeriesDashboardResponse>(
    BASE_URL + "series/dashboard", 
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

  let response = await Promise.all([response_books, response_movie, response_series])
  
  return json({
    books: response[0].data,
    movies: response[1].data,
    series: response[2].data
  }, { status: 200 });

 
}
