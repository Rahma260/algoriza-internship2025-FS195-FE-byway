import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useShoppingContext } from '../Components/Hooks/UseShoppingContext';
import { OrderSummary } from '../Components/Shopping/OrderSummary';
import { PaymentMethodSelector } from '../Components/Shopping/PaymentMethodSelector';
import { LoadingSpinner } from '../Components/Common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading, checkout, fetchCart } = useShoppingContext();

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    paymentMethod: 0,
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!isLoading && cart.itemCount === 0) {
      navigate('/cart');
    }
  }, [cart.itemCount, isLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.country || !formData.state) {
      toast.error('Please fill in country and state');
      return;
    }

    if (formData.paymentMethod === 0) {
      if (
        !formData.cardName ||
        !formData.cardNumber ||
        !formData.expiryDate ||
        !formData.cvv
      ) {
        toast.error('Please fill in all credit card details');
        return;
      }

      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(formData.expiryDate)) {
        toast.error('Invalid expiry date format. Use MM/YY');
        return;
      }

      if (formData.cvv.length < 3 || formData.cvv.length > 4) {
        toast.error('CVV must be 3 or 4 digits');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formatDateForApi = (expiryStr) => {
        if (!expiryStr || expiryStr.length !== 5) return null;
        const [month, yearShort] = expiryStr.split('/');
        const year = 2000 + parseInt(yearShort, 10);
        return `${year}-${month.padStart(2, '0')}-01`;
      };

      const checkoutData = {
        country: formData.country,
        state: formData.state,
        payment: {
          method: formData.paymentMethod,
          cardName: formData.paymentMethod === 0 ? formData.cardName : null,
          cardNumber: formData.paymentMethod === 0 ? formData.cardNumber : null,
          expiryDate:
            formData.paymentMethod === 0
              ? formatDateForApi(formData.expiryDate)
              : null,
          cvv: formData.paymentMethod === 0 ? parseInt(formData.cvv) : null,
        },
      };

      const result = await checkout(checkoutData);

      if (result && result.success) {
        toast.success('Order placed successfully! 🎉');
        setTimeout(() => {
          navigate('/success');
        }, 2000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-lg font-semibold">
            All Development Courses
          </p>
        </div>
        <div className="border-t border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 text-sm text-gray-500 font-medium">
              <button
                onClick={() => navigate('/courses')}
                className="text-gray-900 hover:text-black font-semibold"
              >
                Courses
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => navigate('/cart')}
                className="text-gray-900 hover:text-black font-semibold"
              >
                Shopping Cart
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-semibold">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row lg:space-x-8">
              <div className="w-full lg:w-2/3 space-y-8 mb-8 lg:mb-0">
                <h2 className="text-xl font-bold text-gray-900">Checkout</h2>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Delivery Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter Country"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-600 mb-1"
                      >
                        State / Union Territory
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter State"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Payment Method
                  </h3>

                  <PaymentMethodSelector
                    paymentMethod={formData.paymentMethod}
                    onPaymentMethodChange={handlePaymentMethodChange}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onExpiryChange={handleExpiryChange}
                  />

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || isLoading || cart.itemCount === 0
                    }
                    className="w-full mt-6 bg-black text-white py-3 px-4 rounded-lg font-bold hover:bg-white border border-black hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed duration-500"
                  >
                    {isSubmitting
                      ? 'Processing...'
                      : `Complete Purchase ($${cart.total.toFixed(2)})`}
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-1/3">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <OrderSummary
                    summary={cart}
                    items={cart.items}
                    isCheckout={true}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};