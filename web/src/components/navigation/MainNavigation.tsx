import { Link, Outlet } from "react-router-dom"

const MainNavigation: React.FC = () => {

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