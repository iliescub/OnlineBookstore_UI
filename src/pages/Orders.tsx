import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import type { Order } from '../types/order';

const Orders: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled' | 'closed'>('all');

  useEffect(() => {
    loadOrders();
  }, [currentUser]);

  const loadOrders = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const data = await orderService.getUserOrders(currentUser.id);
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId);
      await loadOrders(); // Reload orders after cancellation
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'closed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-slate-400">View and manage your order history</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'pending', 'completed', 'closed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs opacity-75">
                ({status === 'all' ? orders.length : orders.filter(o => o.status.toLowerCase() === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-300">No orders found</h2>
            <p className="text-slate-400 mb-6">
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
            <a href="/home" className="btn btn-primary inline-block">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-slate-700">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-2xl font-bold text-purple-400">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-slate-400">{order.items.length} item(s)</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-200">{item.title}</h4>
                        <p className="text-sm text-slate-400">by {item.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-purple-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mb-4 p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Shipping Address</p>
                    <p className="text-sm text-slate-300 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  {order.status.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button className="btn btn-ghost ml-auto">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
