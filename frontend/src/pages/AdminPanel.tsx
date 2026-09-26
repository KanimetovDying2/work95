import { useEffect, useState } from "react";
import { axiosApi } from "../api/axiosApi";

interface AdminCocktail {
  _id: string;
  title: string;
  image: string;
  isPublished: boolean;
  author: {
    displayName: string;
  };
}

export const AdminPanel = () => {
  const [cocktails, setCocktails] = useState<AdminCocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllCocktails = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get("/cocktails/admin/all");
      setCocktails(response.data);
    } catch (err: any) {
      setError("Failed to load admin data. Make sure you have admin rights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCocktails();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      await axiosApi.patch(`/cocktails/${id}/publish`);
      fetchAllCocktails();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to publish cocktail");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cocktail?")) return;
    try {
      await axiosApi.delete(`/cocktails/${id}`);
      fetchAllCocktails();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete cocktail");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-400 mb-6">Admin Panel</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {cocktails.map((cocktail) => (
                <tr
                  key={cocktail._id}
                  className="hover:bg-gray-950/50 transition"
                >
                  <td className="p-4 font-medium text-white">
                    {cocktail.title}
                  </td>
                  <td className="p-4 text-gray-400">
                    {cocktail.author?.displayName || "Unknown"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                        cocktail.isPublished
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {cocktail.isPublished ? "Published" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {!cocktail.isPublished && (
                      <button
                        onClick={() => handlePublish(cocktail._id)}
                        className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cocktail._id)}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
