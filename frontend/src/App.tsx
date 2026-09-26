import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<div>Main Page (Cocktails Catalogue)</div>}
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
          <Route
            path="/cocktails/:id"
            element={<div>Cocktail Details Page</div>}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/my-cocktails"
              element={<div>My Cocktails Page</div>}
            />
            <Route
              path="/add-cocktail"
              element={<div>Add Cocktail Form</div>}
            />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
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
}

export default App;
