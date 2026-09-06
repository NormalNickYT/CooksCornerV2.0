import { Route, Routes } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import { DashBoardLayout } from "@/layouts/DashboardLayout";
import { Layout } from "@/layouts/layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import RecipeDetail from "@/pages/RecipeDetail";
import Recipes from "@/pages/Recipes";
import Register from "@/pages/Register";
import AddRecipe from "@/pages/profile/AddRecipe";
import Dashboard from "@/pages/profile/Dashboard";
import EditRecipe from "@/pages/profile/EditRecipe";
import UserRecipes from "@/pages/profile/UserRecipes";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        {/* Accepts an id or a slug, so /recipes/tacos-met-gehakt works. */}
        <Route path="/recipes/:idOrSlug" element={<RecipeDetail />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<DashBoardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-recipe" element={<AddRecipe />} />
          <Route path="/dashboard/user-recipes" element={<UserRecipes />} />
          <Route path="/dashboard/recipes/:id/edit" element={<EditRecipe />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Layout>
            <div className="container mx-auto px-4 py-24 text-center">
              <h1 className="text-3xl font-bold">Pagina niet gevonden</h1>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
}
