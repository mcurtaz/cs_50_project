import axios, { AxiosError } from "axios"

export default function getErrorsMessage(error: unknown | AxiosError): string[]{
    let errors = [];
    if (axios.isAxiosError(error))  {
        // Access to config, request, and response
        if(error.response?.status == 422 && error.response?.data?.errors?.json){ // validation error
            Object.values(error.response.data.errors.json).forEach(err =>{
            if(Array.isArray(err) && typeof err[0] == "string"){
                errors.push(err[0])
            }
            })
        }else if(error.response?.data?.message){
            errors.push(error.response?.data.message)
        }else{
            errors.push(error.message)
        }
    } else {
    // Just a stock error
    errors.push("Ops, something gone wrong. Please retry later!")
    }

    return errors;
}