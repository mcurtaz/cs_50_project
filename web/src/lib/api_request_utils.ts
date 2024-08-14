import axios from "axios"

type ApiRequestResponse = {
    statusCode: number;
    body: object
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const BASE_URL = import.meta.env.VITE_SERVER_BASEURL;

export const apiRequest = async (endpoint: string, params: object, method: Method = "POST", refresh: boolean = true): Promise<ApiRequestResponse> => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");

    if(!accessToken && !refreshToken){
        return {
            statusCode: 403,
            body: {
                message: "no accessToken"
            }
        }
    }

    try {
        console.log(
            BASE_URL + endpoint, 
            params, 
            {
                method: method,
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${accessToken}`,
                    'Accept': "application/json"
                }
            }
        );

        let response = await axios.post(
            BASE_URL + endpoint, 
            params, 
            {
                method: method,
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${accessToken}`,
                    'Accept': "application/json"
                }
            }
        )
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

const refreshToken = () => {

}