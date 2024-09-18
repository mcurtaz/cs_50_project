import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import './App.css'

import { UserContextProvider } from './store/UserContext'

import Login, { submitLogin } from "./pages/login/Login"
import Register, { submitRegister } from "./pages/register/Register"
import BookList, { fetchBookList } from './pages/books/BookList'
import BookAdd, { submitBookAdd } from './pages/books/BookAdd'
import Home from './pages/home/Home'
import MainNavigation from './components/navigation/MainNavigation'
import Logout from './pages/logout/Logout'
import Profile from './pages/profile/Profile'
import BookEdit, {fetchBook, submitBookEdit} from './pages/books/BookEdit'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      // {
      //   index: true,
      //   element: <Navigate replace to='/home'/>
      // },
      {
        path: "/home", 
        element: <Home/>
      },
      {
        path: "/book", 
        element: <BookList/>,
        loader: fetchBookList
      },
      {
        path: "/book/add", 
        element: <BookAdd/>,
        action: submitBookAdd
      },
      {
        path: "/book/:bookId", 
        element: <BookEdit/>,
        loader: fetchBook,
        action: submitBookEdit
      },
      {
        path: "/profile", 
        element: <Profile/>
      },
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
    <div className="text-slate-700 w-screen h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-sky-950">
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </div>
  )
}

export default App
