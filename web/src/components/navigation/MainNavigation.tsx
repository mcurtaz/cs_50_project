import { NavLink, Outlet, useNavigate, useNavigation } from "react-router-dom"
import { useContext, useEffect } from "react";

import { UserContext } from "@/store/UserContext"

import { BookOpenText, House, CircleUser, LoaderCircle } from 'lucide-react';

const MainNavigation: React.FC = () => {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const {user} = useContext(UserContext);

    useEffect(()=>{
        if(!user.isLogged){
            navigate("/login")
        }
    },[user])

    return (
        <div className="w-full h-full border-slate-950 bg-white lg:h-5/6 lg:border lg:shadow-lg lg:rounded-lg lg:w-4/6 flex flex-col-reverse justify-stretch lg:flex-row">
            <nav className="h-20 lg:h-full p-3 border-t lg:p-6 border-sky-950 lg:border-r lg:border-t-0">
                <ul className="flex flex-row justify-around lg:flex-col lg:h-full lg:justify-start">
                    <li>
                        <NavLink 
                            className={({isActive}) => isActive ? "text-pink-700" : "hover:text-pink-600/90"} 
                            to="/home"
                            end
                        >
                            <div className="flex flex-col items-center">
                                <House size={24}/>
                                Home
                            </div>
                        </NavLink>
                    </li>
                    <li className="lg:mt-6">
                        <NavLink 
                            className={({isActive}) => isActive ? "text-pink-700" : "hover:text-pink-600/90"} 
                            to="/book"
                            end
                        >
                            <div className="flex flex-col items-center">
                                <BookOpenText size={24}/>
                                Books
                            </div>
                        </NavLink>
                    </li>
                    <li className="lg:mt-auto">
                        <NavLink 
                            className={({isActive}) => isActive ? "text-pink-700" : "hover:text-pink-600/90"} 
                            to="/profile"
                            end
                        >
                            <div className="flex flex-col items-center">
                                <CircleUser size={24}/>
                                Profile
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="relative w-full h-[calc(100%_-_5rem)] lg:h-full p-3 lg:p-6">
                {/* {navigation.state === "loading" && <div className="absolute top-0 right-0 bg-gray-900/40 w-full h-full flex items-center justify-center"><LoaderCircle className="h-16 w-16 animate-spin text-pink-500"/></div>} */}
                <Outlet />
            </div>
        </div>
      
    )
  }
  
  export default MainNavigation