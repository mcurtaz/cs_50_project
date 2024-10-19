import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react';

import { verifyToken } from "@/utils/verifyToken"
import getErrorsMessage from "@/utils/getErrorsMessage";

import axios, {AxiosError} from "axios"
import {useNavigate, redirect, json, Params, useLoaderData } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

import { Series } from "@/models/series.model";
import SeriesForm from "@/components/series/SeriesForm";
type SeriesResponse = Series

const SeriesEdit: React.FC = () => {
  const navigate = useNavigate();
  const series = useLoaderData() as SeriesResponse;

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-center">
        <Button size={"sm_icon"} onClick={()=> navigate(-1)}>
          <ArrowLeft size={22} />
        </Button>
        {/* <Link className="absolute text-pink-500 hover:text-pink-900" to="/book">
          <ChevronLeft size={32} />
        </Link> */}
        <h1 className="flex-grow text-center text-3xl font-semibold">EDIT SERIES</h1>
      </div>
      <SeriesForm 
        series={series} 
        options={{
          redirect: "/series", 
          success_message: "Series edited successfully", 
          button_label : "Edit series",
          method: "put"
        }}
      />
    </div> 
  )
}

export default SeriesEdit;

export const fetchSeries = async ({params}: {params: Params}) =>{
    let is_token_valid = await verifyToken();

    if(!is_token_valid){
        return redirect("/logout");
    }

    const access_token = sessionStorage.getItem("access_token");

    const seriesId = params.seriesId

    try {
        let response = await axios.get<SeriesResponse>(
        BASE_URL + "series/" + seriesId, 
        {
            headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': "application/json",
            'Authorization': 'Bearer ' + access_token
            }
        }
        )

        return json(response.data, { status: 200 });

    } catch (error: unknown | AxiosError) {  
        const errors = getErrorsMessage(error);

        throw json({message: errors[0], errors: errors}, { status: axios.isAxiosError(error) ? error.response?.status : 500 });
    }
}

export const submitSeriesAction = async ({request, params}: {request: Request, params: Params}) => {
  let is_token_valid = await verifyToken();

  if(!is_token_valid){
    return redirect("/logout");
  }

  const access_token = sessionStorage.getItem("access_token");

  const formData = await request.formData();

  const {seriesId} = params;

  if(request.method === "PUT"){ // UPDATE BOOK
    const data = {
      image_url: formData.get("image_url") ?? null,
      title: formData.get("title"),
      description: formData.get("description"),
      rating: formData.get("rating"),
      status: formData.get("status")
    }
  
    try {
      let response = await axios.put(
        BASE_URL + "series/" + seriesId, 
        data, 
        {
          headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': "application/json",
            'Authorization': 'Bearer ' + access_token
          }
        }
      )
  
      return json({response: response.data },{status: 201})
  
    } catch (error: unknown | AxiosError) {
      const errors = getErrorsMessage(error);
  
      return json({
        errors
      }, {status: 200});
    }
  }

  if(request.method === "DELETE"){ // DELETE BOOK
    try {
      await axios.delete(
        BASE_URL + "series/" + seriesId,
        {
          headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*',
            'Accept': "application/json",
            'Authorization': 'Bearer ' + access_token
          }
        }
      )
  
      return redirect("/movie")
  
    } catch (error: unknown | AxiosError) {
      const errors = getErrorsMessage(error);
  
      return json({
        errors
      }, {status: 200});
    }
  }
}
