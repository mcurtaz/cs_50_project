import { Dispatch, SetStateAction } from "react";
import { Series } from "@/models/series.model";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "../ui/button";

import { Edit, Trash } from "lucide-react";

import { useNavigate } from "react-router-dom";


const SeriesCard: React.FC<{series: Series, setToDelete: Dispatch<SetStateAction<null | Series>>}> = ({series, setToDelete}) => {
  const { image_url, title, description } = series;
  const navigate = useNavigate();

  return (
    <Card className="bg-white-100 min-w-48 w-48 h-72 lg:min-w-56 lg:w-56 lg:h-80">
      <CardHeader>
        <div className="w-full h-[12rem] lg:h-56 mb-2">
          <img 
            src={image_url ? image_url : "/movie-placeholder.svg"} 
            onError={({ currentTarget })=> {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src="/series-placeholder.svg";
            }} 
            className="w-full h-[12rem] lg:h-56 object-cover rounded-md"/> 
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription className="truncate">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {/* <div className="w-20">
          <Rating ratingValue={rating} onClick={()=>{}} size="sm" readonly={true}/>
        </div> */}
        <div className="flex flex-row items-center justify-end">
          <Button onClick={()=> {navigate("/series/" + series.id)}} size="sm_icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button className="ml-2" variant={"destructive"} onClick={()=> {setToDelete(series)}} size="sm_icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default SeriesCard;