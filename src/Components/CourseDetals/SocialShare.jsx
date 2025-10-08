import React from 'react';

const SocialShare = () => (
  <div className="flex items-center space-x-4">
    <span className="text-sm font-medium text-gray-600">Share:</span>
    {[
      { Icon: 'facebook', color: 'text-blue-600' },
      { Icon: 'twitter', color: 'text-sky-400' },
      { Icon: 'google', color: 'text-red-600' },
      { Icon: 'linkedin', color: 'text-blue-700' },
      { Icon: 'mail', color: 'text-gray-500' },
    ].map((item, index) => (
      <a key={index} href="#" className={`text-xl ${item.color} transition hover:opacity-75`}>
        <i className={`fab fa-${item.Icon} ${item.Icon === 'mail' ? 'fa-envelope' : ''}`}></i>
        <span className="sr-only">{item.Icon}</span>
        <div className="w-4 h-4 border rounded-full flex items-center justify-center text-xs opacity-50">
          {item.Icon[0].toUpperCase()}
        </div>
      </a>
    ))}
  </div>
);

export default SocialShare;