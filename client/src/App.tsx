import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/profile/Dashboard";
import { Layout } from "./layouts/layout";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoutes";
import { Footer } from "./components/Footer";
import { DashBoardLayout } from "./layouts/DashboardLayout";
import UserRecipes from "./pages/profile/UserRecipes";
import AddRecipe from "./pages/profile/AddRecipe";

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
                path="/dashboard"
                element={
                  <DashBoardLayout>
                    <Dashboard />
                  </DashBoardLayout>
                }
              />
              <Route
                path="/dashboard/add-recipe"
                element={
                  <DashBoardLayout>
                    <AddRecipe />
                  </DashBoardLayout>
                }
              />
              {/* <Route
                path="/dashboard/favorites"
                element={
                  <DashBoardLayout>
                    <Favorites />
                  </DashBoardLayout>
                }
              /> */}
              <Route
                path="/dashboard/user-recipes"
                element={
                  <DashBoardLayout>
                    <UserRecipes />
                  </DashBoardLayout>
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
