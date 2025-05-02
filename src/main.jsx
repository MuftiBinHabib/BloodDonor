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



const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children:[{
      path: "about",
      element: <About />,
    }]
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
