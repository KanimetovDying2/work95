import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosApi } from "../api/axiosApi";
import { useAuthStore } from "../store/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosApi.post("/users/login", { email, password });
      setAuth(response.data.accessToken, response.data.user);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">
        Sign In to Requ Cocktail
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const response = await axiosApi.post("/users/google", {
                token: credentialResponse.credential,
              });
              setAuth(response.data.accessToken, response.data.user);
              navigate("/");
            } catch (err: any) {
              setError(
                err.response?.data?.message || "Google authentication failed",
              );
            }
          }}
          onError={() => {
            setError("Google Login Failed");
          }}
        />
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-amber-400 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};
