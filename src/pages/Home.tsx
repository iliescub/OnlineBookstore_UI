import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { bookService } from '../services/bookService';
import { genreService } from '../services/genreService';
import type { Book } from '../types/book';
import type { Genre } from '../types/genre';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { itemCount, addToCart, lastAdded, clearLastAdded } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const defaultCover = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80';

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    loadBooks();
    loadGenres();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [selectedCategory]);

  const loadBooks = async () => {
    try {
      const category = selectedCategory !== 'all' ? selectedCategory : undefined;
      const data = await bookService.getBooks(category);
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  };

  const loadGenres = async () => {
    try {
      const data = await genreService.getGenres();
      setGenres(data);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  const categories = useMemo(() => {
    const genreNames = genres.map(g => g.name).sort((a, b) => a.localeCompare(b));
    return ['all', ...genreNames];
  }, [genres]);

  const filteredBooks = useMemo(() => {
    let filtered = books;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(lower) || book.author.toLowerCase().includes(lower)
      );
    }

    return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  }, [books, searchTerm]);

  const handleAddToCart = (book: Book) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (book.stock > 0) {
      addToCart(book);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Discover Your Next Read
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Explore thousands of books across all genres. Find your perfect story today.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              <div className="card p-6">
                <div className="text-3xl font-bold text-purple-400">{books.length}</div>
                <div className="text-sm text-slate-400 mt-1">Books</div>
              </div>
              <div className="card p-6">
                <div className="text-3xl font-bold text-pink-400">{categories.length - 1}</div>
                <div className="text-sm text-slate-400 mt-1">Genres</div>
              </div>
              <div className="card p-6">
                <div className="text-3xl font-bold text-purple-400">{itemCount}</div>
                <div className="text-sm text-slate-400 mt-1">In Cart</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-slate-900/50 border-b border-slate-800 sticky top-16 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-slate-200">Browse by Genre</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'All Books' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              {selectedCategory === 'all' ? 'All Books' : selectedCategory}
            </h2>
            <p className="text-slate-400 mt-1">{filteredBooks.length} books found</p>
          </div>
          {(searchTerm || selectedCategory !== 'all') && (
            <button onClick={resetFilters} className="btn btn-ghost">
              Clear Filters
            </button>
          )}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <article key={book.id} className="card card-hover group">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                  <img
                    src={book.image || defaultCover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {book.stock > 0 ? (
                      <span className="badge badge-success">In Stock</span>
                    ) : (
                      <span className="badge badge-error">Out of Stock</span>
                    )}
                  </div>
                  {book.stock > 0 && book.stock < 5 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="badge badge-warning">Only {book.stock} left</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-400">by {book.author}</p>
                    <p className="text-xs text-purple-400 mt-1">{book.category}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-400">
                      ${book.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stock === 0}
                    className="w-full btn btn-primary"
                  >
                    {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your filters or search term</p>
            <button onClick={resetFilters} className="btn btn-primary mx-auto">
              Show All Books
            </button>
          </div>
        )}
      </section>

      {/* Add to Cart Modal */}
      {lastAdded && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-8 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Added to Cart!</h3>
              <p className="text-slate-400 mb-6">{lastAdded.title} has been added to your cart</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { clearLastAdded(); navigate('/cart'); }}
                  className="flex-1 btn btn-primary"
                >
                  View Cart
                </button>
                <button
                  onClick={clearLastAdded}
                  className="flex-1 btn btn-secondary"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
