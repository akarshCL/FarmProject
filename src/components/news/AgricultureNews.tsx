import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
}

export default function AgricultureNews() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Mock news data - In production, this would fetch from a real API
    setNews([
      {
        id: '1',
        title: 'New Sustainable Farming Techniques Show Promise',
        summary: 'Innovative farming methods are helping farmers reduce water usage while increasing crop yields.',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
        source: 'Agri Times',
        publishedAt: '2024-03-20',
      },
      {
        id: '2',
        title: 'AI in Agriculture: The Future of Farming',
        summary: 'Artificial intelligence is revolutionizing how farmers monitor and manage their crops.',
        imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c34',
        source: 'Tech & Farm',
        publishedAt: '2024-03-19',
      },
      {
        id: '3',
        title: 'Climate-Resilient Crops Development Breakthrough',
        summary: 'Scientists develop new crop varieties that can withstand extreme weather conditions.',
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d',
        source: 'Farm Weekly',
        publishedAt: '2024-03-18',
      },
    ]);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Newspaper className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Agriculture News</h2>
      </div>
      
      <div className="grid gap-6">
        {news.map((item) => (
          <div key={item.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div className="flex gap-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.summary}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span className="mx-2">•</span>
                  <span>{item.publishedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 text-green-600 hover:text-green-700 text-sm font-medium">
        View all news
      </button>
    </div>
  );
}