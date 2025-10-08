import React from "react";
import { Star } from "lucide-react";

const LearnerReviews = ({ fullDetails = false }) => {
  const reviews = [
    {
      id: 1,
      name: "Mark Doe",
      date: "22nd March, 2024",
      text: "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
      rating: 5,
      imageUrl:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Mark Doe",
      date: "22nd March, 2024",
      text: "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
      rating: 5,
      imageUrl:
        "https://randomuser.me/api/portraits/men/33.jpg",
    },
    {
      id: 3,
      name: "Mark Doe",
      date: "22nd March, 2024",
      text: "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
      rating: 5,
      imageUrl:
        "https://randomuser.me/api/portraits/men/34.jpg",
    },
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-8">
      <h3 className="text-2xl font-bold text-gray-900">Learner Reviews</h3>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-gray-900">4.6</span>
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-gray-500 text-sm">
            146,951 reviews
          </p>

          <div className="space-y-2 pt-2">
            {ratingDistribution.map((dist) => (
              <div
                key={dist.stars}
                className="flex items-center gap-2 text-sm"
              >
                <div className="flex items-center gap-1 w-12">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{dist.stars}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-gray-500 w-10 text-right">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-2/3 space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow transition duration-150"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={review.imageUrl}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${review.name}&background=facc15&color=000`;
                  }}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-700 font-medium">
                      {review.rating}
                    </span>
                    <span className="text-gray-400">Reviewed on {review.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}

          <div className="text-center pt-4">
            <button className="border border-gray-800 rounded-lg px-5 py-2 font-medium hover:bg-gray-100 transition">
              View more Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerReviews;
