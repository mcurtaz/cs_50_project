import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './App.css'

import { UserContextProvider } from './store/UserContext'

import Login, { submitLogin } from "./pages/login/Login"
import Register, { submitRegister } from "./pages/register/Register"
import BookList, { fetchBookList } from './pages/books/BookList'
import BookAdd, { submitBookAdd } from './pages/books/BookAdd'
import BookEdit, {fetchBook, submitBookAction} from './pages/books/BookEdit'
import MovieList, { fetchMovieList } from './pages/movies/MovieList'
import MovieAdd, { submitMovieAdd } from './pages/movies/MovieAdd'
import MovieEdit, {fetchMovie, submitMovieAction} from './pages/movies/MovieEdit'
import SeriesList, { fetchSeriesList } from './pages/series/SeriesList'
import SeriesAdd, { submitSeriesAdd } from './pages/series/SeriesAdd'
import SeriesEdit, {fetchSeries, submitSeriesAction} from './pages/series/SeriesEdit'
import Home from './pages/home/Home'
import MainNavigation from './components/navigation/MainNavigation'
import Logout from './pages/logout/Logout'
import Profile from './pages/profile/Profile'
import ErrorPage from './pages/error/ErrorPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    errorElement: <ErrorPage />,
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
        action: submitBookAction
      },
      {
        path: "/movie",
        element: <MovieList/>,
        loader: fetchMovieList
      },
      {
        path: "/movie/add", 
        element: <MovieAdd/>,
        action: submitMovieAdd
      },
      {
        path: "/movie/:movieId", 
        element: <MovieEdit/>,
        loader: fetchMovie,
        action: submitMovieAction
      },
      {
        path: "/series",
        element: <SeriesList/>,
        loader: fetchSeriesList
      },
      {
        path: "/series/add", 
        element: <SeriesAdd/>,
        action: submitSeriesAdd
      },
      {
        path: "/series/:seriesId", 
        element: <SeriesEdit/>,
        loader: fetchSeries,
        action: submitSeriesAction
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
