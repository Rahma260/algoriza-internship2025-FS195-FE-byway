import { useState } from 'react';
import { toast } from 'react-toastify';

export const useCheckout = (setCurrentPage) => {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    paymentMethod: 0,
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
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
    setFormData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const formatDateForApi = (expiryStr) => {
    if (!expiryStr || expiryStr.length !== 5) return null;
    const [month, yearShort] = expiryStr.split('/');
    const year = 2000 + parseInt(yearShort, 10);
    return `${year}-${month.padStart(2, '0')}-01`;
  };

  const validateForm = () => {
    if (!formData.country || !formData.state) {
      toast.error('Please fill in country and state');
      return false;
    }

    if (formData.paymentMethod === 0) {
      if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill in all credit card details');
        return false;
      }

      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(formData.expiryDate)) {
        toast.error('Invalid expiry date format. Use MM/YY');
        return false;
      }

      if (formData.cvv.length < 3 || formData.cvv.length > 4) {
        toast.error('CVV must be 3 or 4 digits');
        return false;
      }
    }

    return true;
  };

  const checkout = async (checkoutData) => {
    try {
      const studentId = localStorage.getItem('userId');
      if (!studentId) {
        toast.error('Please login to checkout');
        return { success: false };
      }

      const response = await fetch(`http://byway.runasp.net/api/Order/CreateOrder?studentId=${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to complete checkout');
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const checkoutData = {
        country: formData.country,
        state: formData.state,
        payment: {
          method: formData.paymentMethod,
          cardName: formData.paymentMethod === 0 ? formData.cardName : null,
          cardNumber: formData.paymentMethod === 0 ? formData.cardNumber : null,
          expiryDate: formData.paymentMethod === 0 ? formatDateForApi(formData.expiryDate) : null,
          cvv: formData.paymentMethod === 0 ? parseInt(formData.cvv) : null
        }
      };

      const result = await checkout(checkoutData);

      if (result && result.success) {
        toast.success('Order placed successfully! 🎉');
        setTimeout(() => {
          setCurrentPage('success');
        }, 2000);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handlePaymentMethodChange,
    handleExpiryChange,
    handleSubmit
  };
};