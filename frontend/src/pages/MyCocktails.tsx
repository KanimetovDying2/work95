import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../api/axiosApi";

interface Cocktail {
  _id: string;
  title: string;
  image: string;
  isPublished: boolean;
  ingredients: {
    name: string;
    amount: string;
  }[];
}

export const MyCocktails = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyCocktails = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get("/cocktails/my");
      setCocktails(response.data);
    } catch (err: any) {
      setError("Failed to load your cocktails.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCocktails();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-400 mb-6">My Cocktails</h1>

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
          <p className="text-xl">You haven't created any cocktails yet</p>
          <Link
            to="/add-cocktail"
            className="inline-block mt-4 text-amber-400 hover:underline text-sm font-semibold"
          >
            Create your first cocktail →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail._id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-gray-950 relative">
                <img
                  src={
                    cocktail.image.startsWith("http")
                      ? cocktail.image
                      : `http://localhost:3000${cocktail.image}`
                  }
                  alt={cocktail.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-md ${
                    cocktail.isPublished
                      ? "bg-green-500/90 text-gray-950"
                      : "bg-amber-500/90 text-gray-950"
                  }`}
                >
                  {cocktail.isPublished ? "Published" : "Waiting for moderator"}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-white mb-2">
                  {cocktail.title}
                </h2>
                <div className="mt-auto pt-3 border-t border-gray-800 text-xs text-gray-400">
                  Ingredients: {cocktail.ingredients.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
