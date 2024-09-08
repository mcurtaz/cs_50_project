import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import './App.css'

import { UserContextProvider } from './store/UserContext'

import Login, { submitLogin } from "./pages/login/Login"
import Register, { submitRegister } from "./pages/register/Register"

import Books, { fetchBooks } from './pages/books/Books'
import Home from './pages/home/Home'
import MainNavigation from './components/navigation/MainNavigation'
import Logout from './pages/logout/Logout'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        index: true,
        element: <Navigate replace to='/home'/>
      },
      {
        path: "/home", 
        element: <Home/>
      },
      {
        path: "/books", 
        element: <Books/>,
        loader: fetchBooks
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
    action: submitLogin
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
    action: submitRegister
  }
])

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-sky-950">
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </div>
  )
}

export default App
