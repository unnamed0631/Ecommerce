import { useState, type MouseEvent } from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { Product } from "@/types";
import { animate } from "motion/react";
import { addCart } from "@/redux/action";

interface FlyToCartProps {
  product: Product;
}

export default function FlyToCart({ product }: FlyToCartProps) {
  const dispatch = useDispatch();
  const [isFlying, setIsFlying] = useState(false);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    if (isFlying) return;

    setIsFlying(true);

    const button = event.currentTarget.getBoundingClientRect();
    const cart = document.getElementById("cart")?.getBoundingClientRect();

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    if (!cart) return;

    const floatingButton = document.createElement("img");
    floatingButton.className =
      "fixed w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg";
    document.body.appendChild(floatingButton);
    floatingButton.src = product.image;
    floatingButton.style.left = `${button.left + button.width / 2 - 24 + scrollX}px`;
    floatingButton.style.top = `${button.top + button.height / 2 - 24 + scrollY}px`;

    animate(
      floatingButton,
      {
        left: cart.left + cart.width / 2 - 24 + scrollX,
        top: cart.top + cart.height / 2 - 24 + scrollY,
        scale: 0,
      },
      {
        duration: 0.6,
        ease: "easeInOut",
        onComplete: () => {
          floatingButton.remove();
          setIsFlying(false);
          dispatch(addCart({ ...product }));
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      aria-label="Add to cart"
      title="Add to cart"
      className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md backdrop-blur transition-all hover:bg-indigo-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
    >
      <ShoppingCart className="h-4.5 w-4.5" />
    </button>
  );
}
