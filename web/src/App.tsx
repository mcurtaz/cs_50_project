import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import './App.css'

import { UserContextProvider } from './store/UserContext'

import Login, { submitLogin } from "./pages/login/Login"
import Register from "./pages/register/Register"

import Books from './pages/books/Books'
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
        element: <Books/>
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
    element: <Register />
  }
])

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  )
}

export default App
