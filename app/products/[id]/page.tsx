import React from "react";
import Image from "next/image";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchProducts } from "@/lib/api";

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

async function getProduct(id: number) {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) || null;
}

export default async function ProductDetailPage({ params }: Props) {
  const productId = Number(params.id);
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="container flex h-96 items-center justify-center px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold">Product Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/products"
            className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div>
          <Badge className="mb-4" variant="outline">
            {product.category}
          </Badge>
          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>
          <div className="mb-4 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(product.rating.rate) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>
          <p className="mb-6 text-lg font-bold">${product.price}</p>
          <p className="mb-6 text-muted-foreground">{product.description}</p>
          <form action="/api/cart/add" method="POST">
            <input type="hidden" name="productId" value={product.id} />
            <div className="mb-6">
              <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                defaultValue="1"
                className="block w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}