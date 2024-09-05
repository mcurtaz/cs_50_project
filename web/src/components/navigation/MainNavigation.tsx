import { Link, Outlet, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react";

import { UserContext } from "@/store/UserContext"

const MainNavigation: React.FC = () => {
    const navigate = useNavigate();

    const {user} = useContext(UserContext);

    useEffect(()=>{
        if(!user.isLogged){
            navigate("/login")
        }
    },[user])

    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/books">Books</Link></li>
                </ul>
            </nav>
            <Outlet />
        </>
      
    )
  }
  
  export default MainNavigation