import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Header from './components/Header.jsx';
import About from './components/About.jsx';
import Banner from './components/Banner.jsx';
import RegisterDonor from './components/RegisterDonor.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children:[
      {
        index: "/",
        element: <Banner />,
      },
      {
      path: "about",
      element: <About />,
    },
    {
      path: "/register",
      element: <RegisterDonor />
    },
    // {
    //   path: "/request",
    //   element: <PostRequest />
    // }
  ]
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
