import { getCategories } from "@/lib/api";
import CategoryCard from "@/components/CategoryCard";
import EmptyState from "@/components/EmptyState";

export const metadata = {
  title: "Categories",
  description: "Browse product categories at Mughal Store.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories = [];
  try {
    const res = await getCategories();
    categories = res.data || res.categories || [];
  } catch {
    categories = [];
  }

  return (
    <div className="container mx-auto px-4 md:pt-5.5 py-6 md:py-10.5">
      <h1 className="text-3xl font-bold text-content-main mb-2">Categories</h1>
      <p className="text-content-sub mb-10">Explore our curated collections</p>
      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Categories will appear once products are added."
          actionLabel="Browse Shop"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.name || cat._id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
