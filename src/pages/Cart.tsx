import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../types/cart';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();

  const defaultCover = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=460&q=80';

  const getItemImage = (item: CartItem): string => {
    return item.image?.trim() ? item.image : defaultCover;
  };

  const lineTotal = (item: CartItem): number => {
    return item.price * item.quantity;
  };

  const goHome = () => {
    navigate('/home');
  };

  const goToCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <section className="block px-[clamp(1.5rem,5vw,3.5rem)] py-[clamp(2rem,5vw,4rem)] bg-gradient-to-b from-[rgba(12,18,34,0.92)] via-[rgba(9,15,28,0.98)] to-[#0b1021] text-[#f5f7ff]">
        <div className="text-center py-16 bg-[rgba(15,22,44,0.65)] rounded-[1.75rem] border border-[rgba(124,215,255,0.12)] max-w-lg mx-auto">
          <div className="text-6xl mb-6" aria-hidden="true">🛒</div>
          <h1 className="text-3xl m-0 mb-4">Your cart is empty</h1>
          <p className="m-0 mb-6 text-[rgba(228,235,255,0.75)]">Add a few stories to your shelf and they will appear here for easy checkout.</p>
          <button
            type="button"
            onClick={goHome}
            className="border-none rounded-full py-3 px-8 bg-gradient-to-r from-[#7cd7ff] to-[#9fe4ff] text-[#0b1021] font-semibold cursor-pointer"
          >
            Browse books
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="block px-[clamp(1.5rem,5vw,3.5rem)] py-[clamp(2rem,5vw,4rem)] bg-gradient-to-b from-[rgba(12,18,34,0.92)] via-[rgba(9,15,28,0.98)] to-[#0b1021] text-[#f5f7ff]">
      <div className="max-w-[1100px] mx-auto grid gap-[clamp(1.8rem,3vw,2.5rem)] grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] max-lg:grid-cols-1">
        <div className="bg-[rgba(15,22,44,0.65)] rounded-[1.75rem] p-[clamp(1.75rem,3vw,2.5rem)] shadow-[0_24px_48px_rgba(5,9,20,0.38)] border border-[rgba(124,215,255,0.12)]">
          <header className="flex justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="m-0 text-[clamp(1.6rem,2.2vw,2.1rem)]">Shopping cart</h1>
              <p className="mt-1.5 m-0 text-[rgba(228,235,255,0.75)]">
                {items.length} {items.length === 1 ? 'book' : 'books'} saved for checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="border-none bg-transparent text-[rgba(255,158,158,0.9)] font-semibold cursor-pointer hover:text-[rgba(255,158,158,1)]"
            >
              Clear all
            </button>
          </header>

          <div className="grid gap-5">
            {items.map((item) => (
              <article key={item.id} className="grid grid-cols-[120px_1fr] gap-6 p-5 rounded-[1.25rem] bg-[rgba(13,20,42,0.8)] border border-[rgba(124,215,255,0.12)] max-sm:grid-cols-1">
                <figure className="m-0 rounded-2xl overflow-hidden shadow-[0_12px_24px_rgba(5,9,20,0.35)]">
                  <img src={getItemImage(item)} alt={item.title} loading="lazy" className="w-full h-full object-cover block" />
                </figure>

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <h2 className="m-0 text-lg">{item.title}</h2>
                    <p className="mt-1 mb-1.5 m-0 text-[rgba(228,235,255,0.75)]">by {item.author}</p>
                    <p className="m-0 font-semibold text-[#7cd7ff]">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="inline-flex items-center rounded-full border border-[rgba(124,215,255,0.2)] bg-[rgba(8,13,26,0.75)]" aria-label="Adjust quantity">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity === 1}
                        aria-label="Decrease quantity"
                        className="border-none bg-transparent text-[#f5f7ff] text-xl w-10 h-10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="min-w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                        className="border-none bg-transparent text-[#f5f7ff] text-xl w-10 h-10 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-[#9fe4ff] min-w-[90px]">${lineTotal(item).toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="border-none bg-transparent text-[rgba(255,158,158,0.9)] font-semibold cursor-pointer hover:text-[rgba(255,158,158,1)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={goHome}
              className="border border-[rgba(124,215,255,0.25)] rounded-full py-2.5 px-6 bg-transparent text-[rgba(124,215,255,0.9)] font-semibold cursor-pointer hover:bg-[rgba(124,215,255,0.15)]"
            >
              Continue browsing
            </button>
          </div>
        </div>

        <aside className="bg-[rgba(15,22,44,0.65)] rounded-[1.75rem] p-[clamp(1.75rem,3vw,2.5rem)] shadow-[0_24px_48px_rgba(5,9,20,0.38)] border border-[rgba(124,215,255,0.12)] h-fit" aria-label="Order summary">
          <h2 className="m-0 mb-6 text-xl">Order summary</h2>
          <dl className="flex justify-between items-center m-0 mb-3">
            <dt>Subtotal</dt>
            <dd className="m-0 font-semibold">${total.toFixed(2)}</dd>
          </dl>
          <dl className="flex justify-between items-center m-0 mb-3">
            <dt>Shipping</dt>
            <dd className="m-0">Free</dd>
          </dl>
          <dl className="flex justify-between items-center m-0 py-4 border-t border-[rgba(124,215,255,0.15)] text-lg font-bold">
            <dt>Total due</dt>
            <dd className="m-0 text-[#7cd7ff]">${total.toFixed(2)}</dd>
          </dl>

          <p className="mt-4 mb-6 m-0 text-sm text-[rgba(228,235,255,0.6)]">Taxes calculated at checkout.</p>

          <button
            type="button"
            onClick={goToCheckout}
            className="w-full border-none rounded-[1.25rem] py-3.5 px-6 bg-gradient-to-r from-[#7cd7ff] to-[#9fe4ff] text-[#0b1021] font-semibold cursor-pointer mb-3 transition-all hover:-translate-y-0.5"
          >
            Proceed to checkout
          </button>
          <button
            type="button"
            onClick={goHome}
            className="w-full border border-[rgba(124,215,255,0.25)] rounded-[1.25rem] py-3 px-6 bg-transparent text-[rgba(124,215,255,0.9)] font-semibold cursor-pointer hover:bg-[rgba(124,215,255,0.15)]"
          >
            Continue shopping
          </button>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
