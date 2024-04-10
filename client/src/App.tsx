import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"; // Importeer Profile component
import ProfileRecipes from "./pages/profile/ProfileRecipes"; // Importeer ProfileRecipes component
import { Layout } from "./layouts/layout"
import { Recipes } from "./components/dashboard/Recipes"

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
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/profile/recipes" element={<Layout><ProfileRecipes /></Layout>} />
    </Routes> 
    </>
  )
}

export default App
