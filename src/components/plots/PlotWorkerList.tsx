import React from 'react';
import { Users, UserMinus } from 'lucide-react';

interface PlotWorker {
  id: string;
  employee: {
    name: string;
    role: string;
  };
  role: string;
  assignedDate: string;
  endDate?: string;
  isActive: boolean;
}

interface PlotWorkerListProps {
  workers: PlotWorker[];
  onRemoveWorker: (workerId: string) => void;
}

export default function PlotWorkerList({ workers, onRemoveWorker }: PlotWorkerListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Assigned Workers</h2>
        </div>
      </div>
      
      <div className="p-6">
        {workers.length === 0 ? (
          <p className="text-gray-500 text-center">No workers assigned to this plot</p>
        ) : (
          <div className="space-y-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{worker.employee.name}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="capitalize">{worker.role}</span>
                    <span className="mx-2">•</span>
                    <span>Assigned: {worker.assignedDate}</span>
                    {worker.endDate && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Until: {worker.endDate}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      worker.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {worker.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => onRemoveWorker(worker.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <UserMinus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}