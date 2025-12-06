import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-gradient-to-br from-[#0b1026] to-[#1b2547] text-[#f5f7ff] px-6 pt-12 pb-8 border-t-4 border-white/10">
      <div className="grid gap-10 max-w-[1100px] mx-auto mb-10 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <section>
          <h2 className="m-0 mb-3 text-[1.75rem] font-semibold">SmartBookstore</h2>
          <p className="m-0 mb-6 leading-relaxed text-[#f5f7ff]/85">
            Discover stories that inspire, educate, and entertain. We curate titles from independent authors and best-selling publishers alike.
          </p>
          <div>
            <p className="my-1 text-[#f5f7ff]/85">
              Email: <a href="mailto:support@smartbookstore.com" className="text-[#7cd7ff] no-underline hover:underline">support@smartbookstore.com</a>
            </p>
            <p className="my-1 text-[#f5f7ff]/85">
              Phone: <a href="tel:+15551234567" className="text-[#7cd7ff] no-underline hover:underline">(555) 123-4567</a>
            </p>
          </div>
        </section>

        <section>
          <h3 className="m-0 mb-4 text-lg uppercase tracking-wider">Explore</h3>
          <ul className="list-none p-0 m-0 grid gap-2">
            <li><Link to="/" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Home</Link></li>
            <li><Link to="/cart" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Cart</Link></li>
            <li><Link to="/checkout" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Checkout</Link></li>
            <li><Link to="/admin" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Admin</Link></li>
          </ul>
        </section>

        <section>
          <h3 className="m-0 mb-4 text-lg uppercase tracking-wider">Community</h3>
          <ul className="list-none p-0 m-0 grid gap-2">
            <li><a href="#" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Book Clubs</a></li>
            <li><a href="#" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Author Spotlights</a></li>
            <li><a href="#" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Events &amp; Workshops</a></li>
            <li><a href="#" className="text-[#f5f7ff]/85 no-underline transition-colors hover:text-white">Gift Cards</a></li>
          </ul>
        </section>

        <section>
          <h3 className="m-0 mb-4 text-lg uppercase tracking-wider">Stay in the loop</h3>
          <p className="m-0 mb-4 text-[#f5f7ff]/80">Subscribe for release alerts, staff picks, and exclusive discounts.</p>
          <form onSubmit={handleNewsletterSubmit} className="grid gap-3">
            <label htmlFor="newsletter-email" className="text-sm text-[#f5f7ff]/70">Email address</label>
            <div className="flex gap-3 max-sm:flex-col">
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 py-3 px-3 rounded-xl border-none text-[0.95rem] bg-white/10 text-[#f5f7ff] placeholder:text-[#f5f7ff]/50 focus:outline-2 focus:outline-[#7cd7ff] focus:outline-offset-2"
              />
              <button
                type="submit"
                className="py-3 px-6 rounded-xl border-none bg-[#7cd7ff] text-[#0b1026] font-semibold cursor-pointer transition-all hover:bg-[#9fe4ff] hover:-translate-y-px max-sm:w-full"
              >
                Subscribe
              </button>
            </div>
            <small className="text-[#f5f7ff]/60">We send one concise update each week. Unsubscribe anytime.</small>
          </form>
        </section>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-wrap gap-4 items-center justify-between max-w-[1100px] mx-auto max-sm:flex-col max-sm:items-start">
        <p>&copy; {currentYear} SmartBookstore. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" aria-label="Follow SmartBookstore on Twitter" className="text-[#f5f7ff]/80 no-underline font-medium hover:text-white">Twitter</a>
          <a href="#" aria-label="Follow SmartBookstore on Instagram" className="text-[#f5f7ff]/80 no-underline font-medium hover:text-white">Instagram</a>
          <a href="#" aria-label="Follow SmartBookstore on Facebook" className="text-[#f5f7ff]/80 no-underline font-medium hover:text-white">Facebook</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
