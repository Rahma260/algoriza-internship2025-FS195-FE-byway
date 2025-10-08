import React from 'react';
import { PlayCircle, Share2, Heart, Gift } from 'lucide-react';
import SocialIcons from '../Layout/SocialIcons';

const PurchaseCard = ({ courseData, onAddToCart, onBuyNow }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative aspect-video bg-white">
        <img
          src={courseData.imageUrl}
          alt="Course Preview"
          className="w-full h-full object-cover rounded-3xl p-4"

        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <PlayCircle className="w-10 h-10 text-gray-600 ml-1" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <p className="text-4xl font-bold text-gray-900">
            ${courseData.price?.toFixed(2) || '0.00'}
          </p>
        </div>

        <button
          onClick={() => onAddToCart?.(courseData.id)}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-white border border-black hover:text-black transition-colors mb-3 transition duration-500 fade-in-out"
        >
          Add To Cart
        </button>

        <button
          onClick={onBuyNow}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg border border-black hover:text-white hover:bg-black mb-3 transition duration-500 fade-in-out"
        >
          Buy Now
        </button>

        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
          <SocialIcons className="hover:bg-black" />
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;