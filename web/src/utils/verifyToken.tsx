import axios, {AxiosError} from "axios"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

type RefreshResponse = {
  "access_token": string
}

export const verifyToken = async (): Promise<boolean> => {
    const access_token = sessionStorage.getItem("access_token");
    const refresh_token = sessionStorage.getItem("refresh_token");
    const access_token_expiration = sessionStorage.getItem("access_token_expiration");
    
    if(!access_token || !refresh_token || !access_token_expiration){
      return false;
    }
    
    const expiration = new Date(access_token_expiration!);
    const now = new Date();

    const difference = (expiration.getTime() - now.getTime()) / 1000;

    if(difference < 120){
        try {
          let response = await axios.post<RefreshResponse>(
            BASE_URL + "refresh",
            {},
            {
              headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': '*',
                'Accept': "application/json",
                'Authorization': 'Bearer ' + refresh_token
              }
            }
          )
      
          sessionStorage.setItem("access_token", response.data.access_token)
          let new_token_expiration = new Date();
          new_token_expiration.setMinutes(new_token_expiration.getMinutes() + 15);
          sessionStorage.setItem("access_token_expiration", new_token_expiration.toISOString())
        
          return true;
        } catch (error: unknown | AxiosError) { 
          return false;
        }
    }

    return true;
}