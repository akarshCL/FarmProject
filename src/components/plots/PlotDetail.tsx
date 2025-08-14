import React, { useState } from 'react';
import { MapPin, Users, Plane as Plant, DollarSign } from 'lucide-react';
import PlotForm from './PlotForm';
import PlotWorkerForm from './PlotWorkerForm';
import PlotWorkerList from './PlotWorkerList';
import FormModal from '../shared/FormModal';
import { useCRUD } from '../../hooks/useCRUD';

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

interface Plot {
  id: string;
  workers: PlotWorker[];
}

export default function PlotDetail() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const { items: plots, create, update } = useCRUD<Plot>({ module: 'plots' });

  const handleAddPlot = async (data: Omit<Plot, 'id'>) => {
    await create(data);
    setIsAddModalOpen(false);
  };

  const handleAddWorker = async (data: any) => {
    if (selectedPlot) {
      const updatedPlot = {
        ...selectedPlot,
        workers: [...selectedPlot.workers, { id: Date.now().toString(), ...data }]
      };
      await update(selectedPlot.id, updatedPlot);
      setIsWorkerModalOpen(false);
      setSelectedPlot(null);
    }
  };

  const handleRemoveWorker = async (plotId: string, workerId: string) => {
    const plot = plots.find(p => p.id === plotId);
    if (plot) {
      const updatedPlot = {
        ...plot,
        workers: plot.workers.filter(w => w.id !== workerId)
      };
      await update(plotId, updatedPlot);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Plot Management</h1>
        <p className="text-gray-600">Manage your farm plots and assigned workers</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Plot List</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Plot
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plot Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{plot.name || 'Plot ' + plot.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{plot.size || 'N/A'} acres</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{plot.location || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{plot.workers?.length || 0} workers</div>
                  </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => {
            setSelectedPlot(plot);
            setIsWorkerModalOpen(true);
          }}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Manage Workers
        </button>
        <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
        <button className="text-red-600 hover:text-red-900">Delete</button>
      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Plot"
      >
        <PlotForm onSubmit={handleAddPlot} />
      </FormModal>

      <FormModal
        isOpen={isWorkerModalOpen}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setSelectedPlot(null);
        }}
        title="Manage Plot Workers"
      >
        <div className="space-y-6">
          <PlotWorkerList
            workers={selectedPlot?.workers || []}
            onRemoveWorker={(workerId) => handleRemoveWorker(selectedPlot!.id, workerId)}
          />
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Add New Worker</h3>
            <PlotWorkerForm
              onSubmit={handleAddWorker}
              employees={[]}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}