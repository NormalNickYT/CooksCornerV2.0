import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./layouts/layout";
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./components/PrivateRoutes";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/Login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route element={<PrivateRoute />}>
              <Route
                path="/dashboard/*"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            </Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
