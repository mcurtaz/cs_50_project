import { Book } from "@/models/book.model";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Rating from "../ui/rating";

  

const BookCard: React.FC<{book: Book}> = ({book}) => {
    const { id, image_url, title, description, author, rating, status } = book;

    return (
      <Card className="bg-gray-100 transition-all duration-300 hover:scale-110 hover:cursor-pointer">
        <CardHeader>
          <div className="w-full flex justify-center">
            <img src={book.image_url ? book.image_url : "/book-placeholder.svg"} className="w-36 h-52 lg:w-44 lg:h-60 object-contain rounded-md mb-3"/> 
          </div>
          <CardTitle>{book.title}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="w-28">
            <Rating ratingValue={book.rating} onClick={()=>{}} size="sm"/>
          </div>
        </CardFooter>
      </Card>
    )
}

export default BookCard;