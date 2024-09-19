import React from "react"
import { Button } from "@/components/ui/button";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom"
import { TriangleAlert } from 'lucide-react';

const ErrorPage: React.FC = ()=>{
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // error is type `ErrorResponse`
        errorMessage = error.data?.message || "Please retry later";
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = 'Unknown error';
    }

    return (
        <div className="w-full h-full lg:h-auto lg:w-2/3 2xl:w-2/5 border p-4 lg:shadow-lg lg:rounded-lg flex flex-col justify-center items-center bg-white">
            <div className="flex flex-row items-center">
                <TriangleAlert size={28} className="text-red-500"/>
                <h1 className="text-3xl ml-3">Ops! Something went wrong</h1>
            </div>
            <p className="text-lg mb-6 mt-3">{errorMessage}</p>
            <Button onClick={() => navigate("/")}>Back</Button>
        </div>
    )
}

export default ErrorPage