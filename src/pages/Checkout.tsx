import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import type { CreateOrderDto, PaymentInfo } from '../types/order';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    fullName: '', email: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    if (!checkoutData.fullName || !checkoutData.email || !checkoutData.addressLine1 || !checkoutData.city || !checkoutData.state || !checkoutData.postalCode) {
      setError('Please complete the delivery address.'); return;
    }
    if (paymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv)) {
      setError('Please provide card details.'); return;
    }
    setSubmitting(true);
    if (!currentUser) { setError('You must be logged in to place an order.'); setSubmitting(false); return; }
    const address = [checkoutData.addressLine1, checkoutData.addressLine2, `${checkoutData.city}, ${checkoutData.state} ${checkoutData.postalCode}`].filter(Boolean).join('\n');
    let paymentInfo: PaymentInfo | undefined;
    if (paymentMethod === 'card') paymentInfo = { ...cardDetails, address };
    const orderDto: CreateOrderDto = { userId: currentUser.id, userName: currentUser.name, items: items.map(i => ({ id: i.id, title: i.title, author: i.author, price: i.price, quantity: i.quantity })), paymentInfo };
    try { await orderService.createOrder(orderDto); clearCart(); navigate('/?placed=true'); }
    catch (err: any) { setError(err.response?.data?.error || 'Order failed.'); setSubmitting(false); }
  };

  return (
    <div className="min-h-screen px-8 py-12 bg-gradient-to-b from-[#0d1426] to-[#1d2f54] text-[#f4f6ff]">
      <div className="max-w-2xl mx-auto bg-[rgba(15,22,44,0.7)] rounded-3xl p-8 border border-[rgba(124,215,255,0.12)]">
        <h1 className="text-3xl mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl">Delivery</h2>
            {[
              ['text', 'fullName', 'Full Name'], ['email', 'email', 'Email'], ['tel', 'phone', 'Phone'],
              ['text', 'addressLine1', 'Address Line 1'], ['text', 'addressLine2', 'Address Line 2']
            ].map(([type, key, placeholder]) => (
              <input key={key} type={type} placeholder={placeholder} value={(checkoutData as any)[key]}
                onChange={(e) => setCheckoutData({ ...checkoutData, [key]: e.target.value })}
                className="w-full p-3 rounded-xl bg-[rgba(6,12,26,0.6)] border border-[rgba(124,215,255,0.2)] text-white" />
            ))}
            <div className="grid grid-cols-3 gap-4">
              {[['city', 'City'], ['state', 'State'], ['postalCode', 'Postal']].map(([key, ph]) => (
                <input key={key} type="text" placeholder={ph} value={(checkoutData as any)[key]}
                  onChange={(e) => setCheckoutData({ ...checkoutData, [key]: e.target.value })}
                  className="p-3 rounded-xl bg-[rgba(6,12,26,0.6)] border border-[rgba(124,215,255,0.2)] text-white" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl">Payment</h2>
            <div className="flex gap-4">
              {(['cash', 'card'] as const).map(method => (
                <button key={method} type="button" onClick={() => setPaymentMethod(method)}
                  className={`flex-1 p-4 rounded-xl border-2 ${paymentMethod === method ? 'border-[#7cd7ff] bg-[rgba(124,215,255,0.1)]' : 'border-[rgba(124,215,255,0.2)]'}`}>
                  {method === 'cash' ? 'Cash' : 'Card'}
                </button>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                {[['cardNumber', 'Card Number'], ['cardName', 'Name'], ['expiry', 'MM/YY'], ['cvv', 'CVV']].map(([key, ph]) => (
                  <input key={key} type="text" placeholder={ph} value={(cardDetails as any)[key]}
                    onChange={(e) => setCardDetails({ ...cardDetails, [key]: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[rgba(6,12,26,0.6)] border border-[rgba(124,215,255,0.2)] text-white" />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between text-xl"><span>Total:</span><span className="font-bold text-[#7cd7ff]">${total.toFixed(2)}</span></div>
          {error && <div className="p-4 rounded-xl bg-[rgba(255,138,128,0.22)] text-[#ffd5d0]">{error}</div>}
          <div className="flex gap-4">
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7cd7ff] to-[#9fe4ff] text-[#0b1021] font-semibold disabled:opacity-50">
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
            <button type="button" onClick={() => navigate('/cart')} className="px-6 py-3 rounded-xl border border-[rgba(124,215,255,0.25)]">Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
