import React from 'react';
import { Tag } from 'lucide-react';

export const OrderSummary = ({
  summary,
  items = [],
  isCheckout = false,
  checkoutAction
}) => {
  if (!summary) return null;

  const total =
    (summary.price || summary.subtotal || 0) +
    (summary.tax || 0) -
    (summary.discount || 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-14">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Order Details {items.length ? `(${items.length})` : ''}
      </h3>

      <div className="space-y-3 mb-6">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="text-gray-700 text-lg font-semibold truncate border-b last:border-none pb-2 "
              title={item.title || item.name}
            >
              {item.title || item.name}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No items in order.</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg mb-6 hover:bg-gray-50 transition">
        <div className="flex items-center space-x-2">
          <Tag size={16} className="text-gray-500" />
          <span className="text-gray-600 text-sm font-semibold">
            APPLY COUPON CODE
          </span>
        </div>
      </div>

      <div className="space-y-2 text-gray-700 text-sm">
        <div className="flex justify-between">
          <span>Price</span>
          <span className="font-semibold">
            ${summary.price?.toFixed(2) || '0.00'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span className="font-semibold text-green-600">
            -${(summary.discount || 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span>Tax</span>
          <span className="font-semibold">
            ${summary.tax?.toFixed(2) || '0.00'}
          </span>
        </div>

        <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
          <span>Total</span>
          <span>${(total || 0).toFixed(2)}</span>
        </div>
      </div>

      {checkoutAction && (
        <button
          onClick={checkoutAction}
          className="mt-6 w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!summary?.itemCount || summary.itemCount === 0}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};