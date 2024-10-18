import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Book, CircleAlert } from 'lucide-react';

import { useEffect, useState } from "react"
import { Form, useNavigation, useActionData, useNavigate, FormMethod } from "react-router-dom"

import Rating from "@/components/ui/rating"
import { Book as BookModel, BookStatus } from "@/models/book.model";

type actionReponse = {
  errors?: string[],
  response?: boolean
}

const BookForm: React.FC<{book: BookModel | null, options: {redirect: string, success_message: string, button_label : string, method: FormMethod}}> = ({book, options}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageUrl, setImageUrl] = useState(book?.image_url ? book.image_url : "");
    const [ratingValue, setRatingValue] = useState(book !== null? book.rating : 0);
  
    const navigation = useNavigation();
    const navigate = useNavigate();
  
    const isSubmitting = navigation.state === 'submitting';
  
    const data = useActionData() as actionReponse;
  
    useEffect(() => {
      if(!data){
        setErrors([]);
      }else if(data.errors){
        setErrors(data.errors);
      }else if(data.response){
        setIsSuccess(true);
  
        setTimeout(() => navigate(options.redirect ?? "/book"), 2000)
      }
    }, [data])
  
    const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) =>{
      const value = e.currentTarget.value;
  
      setImageUrl(value);
    }

    return (
        <ScrollArea className="flex-grow pt-4">
            <Form className="flex flex-col items-center justify-center py-4" method={options.method}>
                <Input type="hidden" name="id" value={book?.id ?? undefined}/>

                <img 
                    src={imageUrl.length > 0 ? imageUrl : "/book-placeholder.svg"} 
                    onError={({ currentTarget })=> {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/book-placeholder.svg";
                    }} 
                    className="w-48 h-56 object-contain mb-8"/> 
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="image_url">Image</Label>
                    <Input type="text" name="image_url" placeholder="Image url" defaultValue={imageUrl} onChange={handleImageUrl}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" name="title" placeholder="Title" defaultValue={book?.title ?? ""} required/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="author">Author</Label>
                    <Input type="text" name="author" placeholder="Author" defaultValue={book?.author ?? ""}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="description">Description</Label>
                    <Textarea className="h-40" name="description" placeholder="Description" defaultValue={book?.description ?? ""} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={book?.status && typeof book.status == "string" ?  book.status : "TO_READ"}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(BookStatus).map((key) => <SelectItem key={key} value={key}>{BookStatus[key as keyof typeof BookStatus]}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="rating">Rating</Label>
                    <Input type="hidden" name="rating" value={ratingValue}/>
                    <div className="w-40">
                    <Rating size="lg" onClick={(value) => setRatingValue(value)} ratingValue={ratingValue}/>
                    </div>
                </div>
                {errors.length > 0 && 
                    <Alert variant="destructive" className="mb-4">
                    {errors.map((err) => <AlertDescription key={err} className="flex items-center"><CircleAlert className="h-4 w-4 mr-2"/>{err}</AlertDescription>)}
                    </Alert>
                }
                
                {!isSuccess && <Button className="mt-6" type="submit" disabled={isSubmitting}>{isSubmitting ? "Loading..." : (options.button_label ?? "Submit")}</Button>}
                {isSuccess && <Alert className="text-emerald-600"><AlertTitle className="flex items-center"><Book className="h-4 w-4 mr-2"/> {options.success_message ?? "Operation completed successfully!"}</AlertTitle></Alert>}
            </Form>
        </ScrollArea>
    )
}

export default BookForm;