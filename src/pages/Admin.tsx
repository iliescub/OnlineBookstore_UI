import React, { useState, useEffect, useMemo } from 'react';
import { bookService } from '../services/bookService';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { genreService } from '../services/genreService';
import type { Book } from '../types/book';
import type { User } from '../types/user';
import type { Order } from '../types/order';
import type { Genre } from '../types/genre';

type Tab = 'books' | 'genres' | 'users' | 'orders';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBooks(); loadGenres(); loadUsers(); loadOrders(); }, []);

  const loadBooks = async () => { try { setBooks(await bookService.getBooks()); } catch (e) { console.error(e); } };
  const loadGenres = async () => { try { setGenres(await genreService.getGenres()); } catch (e) { console.error(e); } };
  const loadUsers = async () => { try { setUsers(await userService.getUsers()); } catch (e) { console.error(e); } };
  const loadOrders = async () => { try { setOrders(await orderService.getOrders()); } catch (e) { console.error(e); } };

  const inventoryValue = useMemo(() => books.reduce((t, b) => t + b.price * b.stock, 0), [books]);
  const categoryCount = useMemo(() => new Set(books.map(b => b.category).filter(Boolean)).size, [books]);
  const pendingOrders = useMemo(() => orders.filter(o => o.status?.toLowerCase().includes('pending')).length, [orders]);

  const saveBook = async () => {
    if (!editingBook) return;
    setSaving(true);
    try {
      if (editingBook.id) await bookService.updateBook(editingBook.id, editingBook);
      else await bookService.createBook(editingBook);
      setEditingBook(null);
      loadBooks();
    } catch (e) { alert('Failed to save book'); }
    setSaving(false);
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    try { await bookService.deleteBook(id); loadBooks(); } catch (e) { alert('Failed to delete'); }
  };

  const saveGenre = async () => {
    if (!editingGenre) return;
    setSaving(true);
    try {
      if (editingGenre.id) await genreService.updateGenre(editingGenre.id, { name: editingGenre.name, description: editingGenre.description });
      else await genreService.createGenre({ name: editingGenre.name, description: editingGenre.description });
      setEditingGenre(null);
      loadGenres();
    } catch (e) { alert('Failed to save genre'); }
    setSaving(false);
  };

  const deleteGenre = async (id: string) => {
    if (!confirm('Delete this genre?')) return;
    try { await genreService.deleteGenre(id); loadGenres(); } catch (e) { alert('Failed to delete'); }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try { await userService.deleteUser(id); loadUsers(); } catch (e) { alert('Failed to delete'); }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=460&q=80';

  return (
    <div className="min-h-screen px-8 py-12 bg-gradient-to-b from-[#0d1426] to-[#1d2f54] text-[#f4f6ff]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[rgba(15,22,44,0.7)] rounded-2xl p-6 border border-[rgba(124,215,255,0.12)]">
            <div className="text-3xl font-bold text-[#7cd7ff]">${inventoryValue.toFixed(2)}</div>
            <div className="text-sm mt-2">Inventory Value</div>
          </div>
          <div className="bg-[rgba(15,22,44,0.7)] rounded-2xl p-6 border border-[rgba(124,215,255,0.12)]">
            <div className="text-3xl font-bold text-[#7cd7ff]">{categoryCount}</div>
            <div className="text-sm mt-2">Categories</div>
          </div>
          <div className="bg-[rgba(15,22,44,0.7)] rounded-2xl p-6 border border-[rgba(124,215,255,0.12)]">
            <div className="text-3xl font-bold text-[#7cd7ff]">{pendingOrders}</div>
            <div className="text-sm mt-2">Pending Orders</div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {(['books', 'genres', 'users', 'orders'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold ${activeTab === tab ? 'bg-gradient-to-r from-[#7cd7ff] to-[#9fe4ff] text-[#0b1021]' : 'bg-[rgba(15,22,44,0.7)] border border-[rgba(124,215,255,0.12)]'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-[rgba(15,22,44,0.7)] rounded-2xl p-8 border border-[rgba(124,215,255,0.12)]">
          {activeTab === 'books' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl">Books ({books.length})</h2>
                <button onClick={() => setEditingBook({ id: '', title: '', author: '', price: 9.99, category: '', stock: 0, image: defaultCover })}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7cd7ff] to-[#9fe4ff] text-[#0b1021] font-semibold">Add Book</button>
              </div>
              {editingBook && (
                <div className="mb-6 p-6 bg-[rgba(6,12,26,0.6)] rounded-xl space-y-4">
                  <h3 className="text-xl mb-4">{editingBook.id ? 'Edit Book' : 'New Book'}</h3>
                  {[['title', 'Title'], ['author', 'Author'], ['category', 'Category'], ['image', 'Image URL']].map(([key, label]) => (
                    <input key={key} type="text" placeholder={label} value={(editingBook as any)[key]}
                      onChange={(e) => setEditingBook({ ...editingBook, [key]: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[rgba(6,12,26,0.8)] border border-[rgba(124,215,255,0.2)] text-white" />
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="0.01" placeholder="Price" value={editingBook.price}
                      onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) || 0 })}
                      className="p-3 rounded-xl bg-[rgba(6,12,26,0.8)] border border-[rgba(124,215,255,0.2)] text-white" />
                    <input type="number" placeholder="Stock" value={editingBook.stock}
                      onChange={(e) => setEditingBook({ ...editingBook, stock: parseInt(e.target.value) || 0 })}
                      className="p-3 rounded-xl bg-[rgba(6,12,26,0.8)] border border-[rgba(124,215,255,0.2)] text-white" />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={saveBook} disabled={saving} className="px-6 py-2 rounded-xl bg-[#7cd7ff] text-[#0b1021] font-semibold disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingBook(null)} className="px-6 py-2 rounded-xl border border-[rgba(124,215,255,0.25)]">Cancel</button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {books.map(book => (
                  <div key={book.id} className="flex items-center justify-between p-4 bg-[rgba(6,12,26,0.6)] rounded-xl">
                    <div>
                      <div className="font-semibold">{book.title}</div>
                      <div className="text-sm text-[rgba(228,235,255,0.7)]">{book.author} | ${book.price} | Stock: {book.stock}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingBook(book)} className="px-4 py-2 rounded-lg bg-[rgba(124,215,255,0.2)] hover:bg-[rgba(124,215,255,0.3)]">Edit</button>
                      <button onClick={() => deleteBook(book.id)} className="px-4 py-2 rounded-lg bg-[rgba(255,138,128,0.2)] hover:bg-[rgba(255,138,128,0.3)]">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'genres' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl">Genres ({genres.length})</h2>
                <button onClick={() => setEditingGenre({ id: '', name: '', description: '', createdAt: '' })}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7cd7ff] to-[#9fe4ff] text-[#0b1021] font-semibold">Add Genre</button>
              </div>
              {editingGenre && (
                <div className="mb-6 p-6 bg-[rgba(6,12,26,0.6)] rounded-xl space-y-4">
                  <h3 className="text-xl mb-4">{editingGenre.id ? 'Edit Genre' : 'New Genre'}</h3>
                  <input type="text" placeholder="Genre Name" value={editingGenre.name}
                    onChange={(e) => setEditingGenre({ ...editingGenre, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[rgba(6,12,26,0.8)] border border-[rgba(124,215,255,0.2)] text-white" />
                  <textarea placeholder="Description" value={editingGenre.description} rows={3}
                    onChange={(e) => setEditingGenre({ ...editingGenre, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[rgba(6,12,26,0.8)] border border-[rgba(124,215,255,0.2)] text-white" />
                  <div className="flex gap-4">
                    <button onClick={saveGenre} disabled={saving} className="px-6 py-2 rounded-xl bg-[#7cd7ff] text-[#0b1021] font-semibold disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingGenre(null)} className="px-6 py-2 rounded-xl border border-[rgba(124,215,255,0.25)]">Cancel</button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {genres.map(genre => (
                  <div key={genre.id} className="flex items-center justify-between p-4 bg-[rgba(6,12,26,0.6)] rounded-xl">
                    <div>
                      <div className="font-semibold">{genre.name}</div>
                      <div className="text-sm text-[rgba(228,235,255,0.7)]">{genre.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingGenre(genre)} className="px-4 py-2 rounded-lg bg-[rgba(124,215,255,0.2)] hover:bg-[rgba(124,215,255,0.3)]">Edit</button>
                      <button onClick={() => deleteGenre(genre.id)} className="px-4 py-2 rounded-lg bg-[rgba(255,138,128,0.2)] hover:bg-[rgba(255,138,128,0.3)]">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl mb-6">Users ({users.length})</h2>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-[rgba(6,12,26,0.6)] rounded-xl">
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-[rgba(228,235,255,0.7)]">{user.email} | {user.role}</div>
                    </div>
                    <button onClick={() => deleteUser(user.id)} className="px-4 py-2 rounded-lg bg-[rgba(255,138,128,0.2)] hover:bg-[rgba(255,138,128,0.3)]">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl mb-6">Orders ({orders.length})</h2>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="p-4 bg-[rgba(6,12,26,0.6)] rounded-xl border border-[rgba(124,215,255,0.08)]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-lg">{order.userName}</div>
                        <div className="text-xs text-[rgba(228,235,255,0.5)]">Order #{order.id.slice(0,8)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#7cd7ff] font-bold text-lg">${order.total.toFixed(2)}</div>
                        <div className={`text-xs px-2 py-1 rounded mt-1 ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'closed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[rgba(228,235,255,0.7)] mb-3">
                      <div>{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="mt-1">{order.items.length} item(s)</div>
                      {order.shippingAddress && (
                        <div className="mt-2 text-xs bg-[rgba(6,12,26,0.4)] p-2 rounded">
                          <div className="text-[rgba(228,235,255,0.5)] mb-1">Shipping:</div>
                          <div className="whitespace-pre-line">{order.shippingAddress}</div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-[rgba(124,215,255,0.08)]">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={async () => {
                              if (confirm(`Mark order as completed?`)) {
                                try {
                                  await orderService.completeOrder(order.id);
                                  loadOrders();
                                } catch (e) { alert('Failed to update order'); }
                              }
                            }}
                            className="px-3 py-1.5 text-sm rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                          >
                            Complete Order
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Cancel this order?`)) {
                                try {
                                  await orderService.cancelOrder(order.id);
                                  loadOrders();
                                } catch (e) { alert('Failed to cancel order'); }
                              }
                            }}
                            className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {order.status === 'completed' && (
                        <button
                          onClick={async () => {
                            if (confirm(`Close this order (delivery confirmed)?`)) {
                              try {
                                await orderService.closeOrder(order.id);
                                loadOrders();
                              } catch (e) { alert('Failed to update order'); }
                            }
                          }}
                          className="px-3 py-1.5 text-sm rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                        >
                          Close Order
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const itemsList = order.items.map(i => `- ${i.title} by ${i.author} ($${i.price} × ${i.quantity})`).join('\n');
                          alert(`Order Details:\n\nCustomer: ${order.userName}\nTotal: $${order.total}\nStatus: ${order.status}\nDate: ${new Date(order.date).toLocaleString()}\n\nItems:\n${itemsList}`);
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg bg-[rgba(124,215,255,0.1)] text-[#7cd7ff] border border-[rgba(124,215,255,0.2)] hover:bg-[rgba(124,215,255,0.15)] ml-auto"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
