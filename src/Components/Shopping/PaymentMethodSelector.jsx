import React from 'react';
import visaLogo from '/images/visa.png';
import paypalLogo from '/images/paypal.png';

export const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange,
  formData,
  onInputChange,
  onExpiryChange
}) => (
  <div className="space-y-5">
    <label
      className={`block rounded-2xl border ${paymentMethod === 0
        ? 'border-blue-500 bg-blue-50/40'
        : 'border-gray-200 bg-white'
        } p-5 cursor-pointer transition`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            checked={paymentMethod === 0}
            onChange={() => onPaymentMethodChange(0)}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="font-semibold text-gray-900">
            Credit/Debit Card
          </span>
        </div>
        <img
          src={
            visaLogo ||
            'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
          }
          alt="Visa"
          className="h-5"
        />
      </div>

      {paymentMethod === 0 && (
        <div className="space-y-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={onInputChange}
              placeholder="John Doe"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={onInputChange}
              placeholder="0000 0000 0000 0000"
              pattern="[0-9]{13,19}"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={onExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                CVC/CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={onInputChange}
                placeholder="123"
                pattern="[0-9]{3,4}"
                maxLength={4}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-gray-800"
                required
              />
            </div>
          </div>
        </div>
      )}
    </label>

    <label
      className={`block rounded-2xl border ${paymentMethod === 1
        ? 'border-blue-500 bg-blue-50/40'
        : 'border-gray-200 bg-white'
        } p-5 cursor-pointer transition`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            checked={paymentMethod === 1}
            onChange={() => onPaymentMethodChange(1)}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="font-semibold text-gray-900">PayPal</span>
        </div>
        <img
          src={
            paypalLogo ||
            'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg'
          }
          alt="PayPal"
          className="h-5"
        />
      </div>
    </label>
  </div>
);