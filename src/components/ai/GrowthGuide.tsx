import React, { useState } from 'react';
import { Plane as Plant, Search } from 'lucide-react';

interface CropGuide {
  name: string;
  type: 'vegetable' | 'fruit';
  growthPeriod: string;
  wateringNeeds: string;
  soilType: string;
  sunlight: string;
  tips: string[];
}

export default function GrowthGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropGuide | null>(null);

  const cropGuides: CropGuide[] = [
    {
      name: 'Tomatoes',
      type: 'vegetable',
      growthPeriod: '60-80 days',
      wateringNeeds: 'Regular, consistent moisture',
      soilType: 'Well-draining, rich in organic matter',
      sunlight: 'Full sun (6-8 hours daily)',
      tips: [
        'Start seeds indoors 6-8 weeks before last frost',
        'Space plants 18-36 inches apart',
        'Support with cages or stakes',
        'Prune suckers for better airflow',
        'Monitor for common pests like hornworms',
      ],
    },
    {
      name: 'Apples',
      type: 'fruit',
      growthPeriod: '100-160 days',
      wateringNeeds: 'Moderate, consistent moisture',
      soilType: 'Well-draining, slightly acidic',
      sunlight: 'Full sun (6-8 hours daily)',
      tips: [
        'Plant in early spring or late fall',
        'Space trees 15-20 feet apart',
        'Prune annually for shape and production',
        'Thin fruits for better size and quality',
        'Monitor for apple scab and fire blight',
      ],
    },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const found = cropGuides.find(
      crop => crop.name.toLowerCase().includes(term.toLowerCase())
    );
    setSelectedCrop(found || null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Plant className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Growth Guide</h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for a crop..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {selectedCrop ? (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">{selectedCrop.name}</h3>
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {selectedCrop.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Growth Period</p>
              <p className="text-gray-800">{selectedCrop.growthPeriod}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Watering Needs</p>
              <p className="text-gray-800">{selectedCrop.wateringNeeds}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Soil Type</p>
              <p className="text-gray-800">{selectedCrop.soilType}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Sunlight</p>
              <p className="text-gray-800">{selectedCrop.sunlight}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">Growing Tips</h4>
            <ul className="space-y-2">
              {selectedCrop.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Search for a crop to see growing guidelines</p>
        </div>
      )}
    </div>
  );
}