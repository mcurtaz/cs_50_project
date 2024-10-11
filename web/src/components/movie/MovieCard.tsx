import { Dispatch, SetStateAction } from "react";
import { Movie } from "@/models/movie.model";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";

import { Edit, Trash } from "lucide-react";

import Rating from "../ui/rating";

import { useNavigate } from "react-router-dom";


const MovieCard: React.FC<{movie: Movie, setToDelete: Dispatch<SetStateAction<null | Movie>>}> = ({movie, setToDelete}) => {
  const { image_url, title, rating } = movie;
  const navigate = useNavigate();

  return (
    <Card className="bg-white-100 w-64 h-96">
      <CardHeader>
        <div className="w-full h-64 mb-3">
          <img 
            src={image_url ? image_url : "/movie-placeholder.svg"} 
            onError={({ currentTarget })=> {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src="/movie-placeholder.svg";
            }} 
            className="w-full h-64 object-cover rounded-md"/> 
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="truncate">{title}</CardTitle>
      </CardContent>
      <CardFooter>
        <div className="w-20">
          <Rating ratingValue={rating} onClick={()=>{}} size="sm" readonly={true}/>
        </div>
        <div className="flex flex-row items-center justify-end mt-2">
          <Button onClick={()=> {navigate("/movie/" + movie.id)}} size="sm_icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button className="ml-2" variant={"destructive"} onClick={()=> {setToDelete(movie)}} size="sm_icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MovieCard;