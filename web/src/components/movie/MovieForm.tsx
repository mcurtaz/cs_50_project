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

import { Film, CircleAlert } from 'lucide-react';

import { useEffect, useState } from "react"
import { Form, useNavigation, useActionData, useNavigate, FormMethod } from "react-router-dom"

import Rating from "@/components/ui/rating"
import { Movie as MovieModel, MovieStatus } from "@/models/movie.model";

type actionReponse = {
  errors?: string[],
  response?: boolean
}

const MovieForm: React.FC<{movie: MovieModel | null, options: {redirect: string, success_message: string, button_label : string, method: FormMethod}}> = ({movie, options}) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageUrl, setImageUrl] = useState(movie?.image_url ? movie.image_url : "");
    const [ratingValue, setRatingValue] = useState(movie !== null? movie.rating : 0);
  
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
  
        setTimeout(() => navigate(options.redirect ?? "/movies"), 2000)
      }
    }, [data])
  
    const handleImageUrl = (e: React.ChangeEvent<HTMLInputElement>) =>{
      const value = e.currentTarget.value;
  
      setImageUrl(value);
    }

    return (
        <ScrollArea className="flex-grow pt-4">
            <Form className="flex flex-col items-center justify-center py-4" method={options.method}>
                <Input type="hidden" name="id" value={movie?.id ?? undefined}/>

                <img 
                    src={imageUrl.length > 0 ? imageUrl : "/movie-placeholder.svg"} 
                    onError={({ currentTarget })=> {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="/movie-placeholder.svg";
                    }} 
                    className="w-48 h-56 object-contain mb-8"/> 
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="image_url">Image</Label>
                    <Input type="text" name="image_url" placeholder="Image url" defaultValue={imageUrl} onChange={handleImageUrl}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" name="title" placeholder="Title" defaultValue={movie?.title ?? ""} required/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="description">Description</Label>
                    <Textarea className="h-40" name="description" placeholder="Description" defaultValue={movie?.description ?? ""} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mb-6">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={movie?.status && typeof movie.status == "string" ?  movie.status : "TO_WATCH"}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(MovieStatus).map((key) => <SelectItem value={key}>{MovieStatus[key as keyof typeof MovieStatus]}</SelectItem>)}
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
                {isSuccess && <Alert className="text-emerald-600"><AlertTitle className="flex items-center"><Film className="h-4 w-4 mr-2"/> {options.success_message ?? "Operation completed successfully!"}</AlertTitle></Alert>}
            </Form>
        </ScrollArea>
    )
}

export default MovieForm;