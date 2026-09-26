import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosApi } from "../api/axiosApi";

interface IngredientInput {
  name: string;
  amount: string;
}

export const AddCocktail = () => {
  const [title, setTitle] = useState("");
  const [recipe, setRecipe] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: "", amount: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleIngredientChange = (
    index: number,
    field: "name" | "amount",
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const removeIngredientField = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select an image for the cocktail.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("recipe", recipe);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("image", image);

      await axiosApi.post("/cocktails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create cocktail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">
        Add New Cocktail
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
            placeholder="Margarita"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Recipe Description
          </label>
          <textarea
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
            required
            rows={4}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
            placeholder="Step-by-step instructions..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Ingredients
            </label>
            <button
              type="button"
              onClick={addIngredientField}
              className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md hover:bg-amber-500/20 transition"
            >
              + Add Ingredient
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  required
                  className="flex-grow bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  placeholder="Amount (e.g. 50ml)"
                  value={ing.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                  required
                  className="w-36 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientField(index)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 text-sm font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Cocktail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            required
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-950 hover:file:bg-amber-600 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Cocktail"}
        </button>
      </form>
    </div>
  );
};
