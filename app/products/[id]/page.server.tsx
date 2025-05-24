import { fetchProducts } from "@/lib/api";

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    return products.map((product) => ({
      id: String(product.id),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}