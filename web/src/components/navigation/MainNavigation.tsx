import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react";

import { UserContext } from "@/store/UserContext"

import { BookOpenText, House, CircleUser } from 'lucide-react';

const MainNavigation: React.FC = () => {
    const navigate = useNavigate();

    const {user} = useContext(UserContext);

    useEffect(()=>{
        if(!user.isLogged){
            navigate("/login")
        }
    },[user])

    return (
        <div className="w-full h-full border-slate-950 bg-white lg:h-5/6 lg:border lg:shadow-lg lg:rounded-lg lg:w-4/6 flex flex-col-reverse justify-stretch lg:flex-row">
            <nav className="p-3 border-t lg:p-6 border-sky-950 lg:border-r lg:border-t-0">
                <ul className="flex flex-row justify-around lg:flex-col lg:h-full lg:justify-start">
                    <li>
                        <NavLink 
                            className={({isActive}) => isActive ? "text-pink-500" : "hover:text-pink-900"} 
                            to="/home"
                        >
                            <div className="flex flex-col items-center">
                                <House size={24}/>
                                Home
                            </div>
                        </NavLink>
                    </li>
                    <li className="lg:mt-6">
                        <NavLink 
                            className={({isActive}) => isActive ? "text-pink-500" : "hover:text-pink-900"} 
                            to="/books"
                        >
                            <div className="flex flex-col items-center">
                                <BookOpenText size={24}/>
                                Books
                            </div>
                        </NavLink>
                    </li>
                    <li className="lg:mt-auto">
                        <NavLink 
                            className={({isActive}) => isActive ? "text-pink-500" : "hover:text-pink-900"} 
                            to="/profile"
                        >
                            <div className="flex flex-col items-center">
                                <CircleUser size={24}/>
                                Profile
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="flex-grow p-3 lg:p-6">
                <Outlet />
            </div>
        </div>
      
    )
  }
  
  export default MainNavigation