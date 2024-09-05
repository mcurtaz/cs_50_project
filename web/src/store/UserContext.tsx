import { createContext, useState, useEffect, Dispatch, SetStateAction } from "react"

type UserContextType = {
    isLogged: boolean,
    email: string | null,
    id: number | null
}

type MeResponse = {
    "id": number,
    "email": string
}

const UserContextDefaultValue = {
    user: {
        isLogged: false,
        email: null,
        id: null
    },
    setUser: () => {}
}

import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASEURL;

export const UserContext = createContext<{
    user: UserContextType,
    setUser: React.Dispatch<React.SetStateAction<UserContextType>>;
}>(UserContextDefaultValue);

export const UserContextProvider = (props: React.PropsWithChildren<{}>) => {
    const [user, setUser] = useState<UserContextType>(UserContextDefaultValue.user);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const access_token = sessionStorage.getItem("access_token");

        if(access_token){
            const getUserInfo = async () => {
                try{
                    let response = await axios.post<MeResponse>(
                        BASE_URL + "me", 
                        {},
                        {
                            headers: {
                                'Authorization': "Bearer " + access_token
                            }
                        }
                    )

                    setUser({
                        isLogged: true,
                        id: response.data.id,
                        email: response.data.email
                    })
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                }
            }
            
            getUserInfo();
        }else{
            setLoading(false)
        }
    }, [])

    return (
        <UserContext.Provider value={{user, setUser}} >
            {!loading && props.children}
            {loading && <h1>Loading...</h1>}
        </UserContext.Provider>
    )
}