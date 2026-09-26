import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CocktailDetails } from "./pages/CocktailDetails.tsx";
import { MyCocktails } from "./pages/MyCocktails";
import { AddCocktail } from "./pages/AddCocktail";
import { AdminPanel } from "./pages/AdminPanel";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cocktails/:id" element={<CocktailDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/my-cocktails" element={<MyCocktails />} />
            <Route path="/add-cocktail" element={<AddCocktail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-amber-400 mb-4">404</h1>
                <p className="text-xl text-gray-400">Page not found</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
