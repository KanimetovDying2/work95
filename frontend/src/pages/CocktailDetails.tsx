import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../api/axiosApi";
import { useAuthStore } from "../store/useAuthStore";

interface Ingredient {
  name: string;
  amount: string;
  _id?: string;
}

interface CocktailDetail {
  _id: string;
  title: string;
  recipe: string;
  image: string;
  isPublished: boolean;
  author: {
    displayName: string;
  };
  ingredients: Ingredient[];
  averageRating?: number;
  totalRatings?: number;
}

export const CocktailDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [cocktail, setCocktail] = useState<CocktailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState<number>(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const fetchCocktail = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`/cocktails/${id}`);
      setCocktail(response.data);
    } catch (err: any) {
      setError("Failed to load cocktail details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCocktail();
  }, [id]);

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRatingSubmitting(true);
      await axiosApi.post(`/cocktails/${id}/rating`, { value: userRating });
      await fetchCocktail();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !cocktail) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-xl mb-4">
          {error || "Cocktail not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-amber-500 text-gray-950 px-4 py-2 rounded-lg font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-72 md:h-full bg-gray-950 relative">
          <img
            src={
              cocktail.image.startsWith("http")
                ? cocktail.image
                : `http://localhost:3000${cocktail.image}`
            }
            alt={cocktail.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-amber-400">
                {cocktail.title}
              </h1>
              {cocktail.averageRating !== undefined && (
                <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg text-amber-400 font-bold text-sm">
                  ⭐ {cocktail.averageRating.toFixed(1)}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Created by{" "}
              <span className="text-gray-200 font-medium">
                {cocktail.author?.displayName}
              </span>
            </p>

            <h3 className="text-lg font-semibold text-white mb-2">
              Ingredients:
            </h3>
            <ul className="space-y-1.5 mb-6">
              {cocktail.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-sm bg-gray-950 px-3 py-2 rounded-lg border border-gray-800/60"
                >
                  <span className="text-gray-300">{ing.name}</span>
                  <span className="text-amber-400 font-medium">
                    {ing.amount}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2">Recipe:</h3>
            <p className="text-gray-300 text-sm whitespace-pre-line bg-gray-950 p-4 rounded-lg border border-gray-800/60 mb-6">
              {cocktail.recipe}
            </p>
          </div>

          <div className="border-t border-gray-800 pt-4 mt-auto">
            <form
              onSubmit={handleRateSubmit}
              className="flex items-center gap-3"
            >
              <select
                value={userRating}
                onChange={(e) => setUserRating(Number(e.target.value))}
                className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={ratingSubmitting}
                className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm transition disabled:opacity-50 flex-grow"
              >
                {ratingSubmitting ? "Submitting..." : "Rate Cocktail"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
