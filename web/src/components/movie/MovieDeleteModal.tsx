import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { buttonVariants } from "../ui/button";

import {  SetStateAction, Dispatch } from "react";
import { Movie } from "@/models/movie.model";
import {  useSubmit } from "react-router-dom";

const MovieDeleteModal: React.FC<{toDelete: Movie | null, setToDelete: Dispatch<SetStateAction<null | Movie>>}> = ({toDelete, setToDelete}) => {
    const submit = useSubmit();

    return (
        <AlertDialog
            open={toDelete !== null}
            onOpenChange={(arg) => {
                if(!arg){
                    setToDelete(null)
                }
            }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete "{toDelete?.title}" permanently
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={()=> submit(null, {method: "DELETE", action: "/movie/" + toDelete?.id})}
                className={buttonVariants({ variant: "destructive" })}
              >Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
}
  
export default MovieDeleteModal;

  