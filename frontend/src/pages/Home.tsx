import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../api/axiosApi";

interface Cocktail {
  _id: string;
  title: string;
  image: string;
  isPublished: boolean;
  author: {
    displayName: string;
  };
  ingredients: {
    name: string;
    amount: string;
  }[];
}

export const Home = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const fetchCocktails = async (ingredientQuery = "") => {
    try {
      setLoading(true);
      const url = ingredientQuery
        ? `/cocktails?ingredient=${encodeURIComponent(ingredientQuery)}`
        : "/cocktails";
      const response = await axiosApi.get(url);

      console.log("DATA FROM BACKEND:", response.data);
      
      setCocktails(response.data);
    } catch (err: any) {
      setError("Failed to load cocktails. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCocktails(selectedIngredient);
  }, [selectedIngredient]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">
            Cocktail Catalog
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Discover and share the best drink recipes
          </p>
        </div>

        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Filter by ingredient..."
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-400 w-full md:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : cocktails.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No cocktails found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <Link
              key={cocktail._id}
              to={`/cocktails/${cocktail._id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition group flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-gray-950 relative">
                <img
                  src={
                    cocktail.image.startsWith("http")
                      ? cocktail.image
                      : `http://localhost:3000${cocktail.image}`
                  }
                  alt={cocktail.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {!cocktail.isPublished && (
                  <span className="absolute top-3 right-3 bg-amber-500/90 text-gray-950 text-xs font-bold px-2.5 py-1 rounded-md">
                    Unpublished
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition mb-1">
                  {cocktail.title}
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  By{" "}
                  <span className="text-gray-300 font-medium">
                    {cocktail.author?.displayName || "Unknown"}
                  </span>
                </p>

                <div className="mt-auto pt-3 border-t border-gray-800 text-xs text-gray-400">
                  Ingredients: {cocktail.ingredients.length}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
