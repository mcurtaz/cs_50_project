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
import { Book } from "@/models/book.model";
import {  useSubmit } from "react-router-dom";

const BookDeleteModal: React.FC<{toDelete: Book | null, setToDelete: Dispatch<SetStateAction<null | Book>>}> = ({toDelete, setToDelete}) => {
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
                This action will delete {toDelete?.title}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={()=> submit(null, {method: "DELETE", action: "/book/" + toDelete?.id})}
                className={buttonVariants({ variant: "destructive" })}
              >Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
}
  
export default BookDeleteModal;

  