import Navbar from "./components/Navbar"
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"; 
import { Layout } from "./layouts/layout"
import { useEffect, useState } from "react"
import axios from "axios"
import AuthProvider from "./hooks/AuthProvider";

function App() {
  return (
    <>
    <AuthProvider>
     <Navbar />
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
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      </Routes> 
    </AuthProvider>
    </>
  )
}

export default App
