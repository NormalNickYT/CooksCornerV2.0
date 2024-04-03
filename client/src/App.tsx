import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { Layout } from "./layouts/layout"

function App() {
  return (
    <>
    <Routes> 
      <Route path="/" element={ 
      <Layout>
        <Home />
      </Layout>
      } />
      <Route path="/Login" element={
         <Layout>
         <Login />
       </Layout>
      } />
    </Routes> 
    </>
  )
}

export default App
