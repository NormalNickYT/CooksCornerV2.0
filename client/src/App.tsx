import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Dashboard"; // Importeer Profile component
import { Layout } from "./layouts/layout"
import { Recipes } from "./components/dashboard/DashRecipes"

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
      } 
      />
      {/* WILL ADD: only authorized users allowed  */}
      <Route path="/dashboard" element={<Layout><Profile /></Layout>} />
    </Routes> 
    </>
  )
}

export default App
