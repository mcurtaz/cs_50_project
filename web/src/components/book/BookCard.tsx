import { Book } from "@/models/book.model";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";

import { Edit, Trash } from "lucide-react";

import Rating from "../ui/rating";

import { useNavigate } from "react-router-dom";

  

const BookCard: React.FC<{book: Book}> = ({book}) => {
  const { image_url, title, author, rating } = book;
  const navigate = useNavigate();

  return (
    <Card className="bg-gray-100">
      <CardHeader>
        <div className="w-full flex justify-center">
          <img src={image_url ? image_url : "/book-placeholder.svg"} className="w-full object-contain rounded-md mb-3"/> 
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription className="truncate">{author}</CardDescription>
      </CardContent>
      <CardFooter>
        <div className="w-20">
          <Rating ratingValue={rating} onClick={()=>{}} size="sm"/>
        </div>
        <div className="flex flex-row items-center justify-end mt-2">
          <Button onClick={()=> {navigate("/book/" + book.id)}} size="sm_icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button className="ml-2" variant={"destructive"} onClick={()=> {navigate("/book/add")}} size="sm_icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default BookCard;