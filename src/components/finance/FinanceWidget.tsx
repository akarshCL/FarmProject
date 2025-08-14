import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function FinanceWidget() {
  const financeData = {
    revenue: {
      current: '₹125,000',
      trend: '+12.5%',
      isPositive: true
    },
    expenses: {
      current: '₹45,000',
      trend: '-5.2%',
      isPositive: true
    },
    profit: {
      current: '₹80,000',
      trend: '+15.3%',
      isPositive: true
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-lg font-semibold">{financeData.revenue.current}</p>
            </div>
          </div>
          <div className={`flex items-center ${financeData.revenue.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {financeData.revenue.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{financeData.revenue.trend}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <p className="text-lg font-semibold">{financeData.expenses.current}</p>
            </div>
          </div>
          <div className={`flex items-center ${financeData.expenses.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {financeData.expenses.isPositive ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{financeData.expenses.trend}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-lg font-semibold">{financeData.profit.current}</p>
            </div>
          </div>
          <div className={`flex items-center ${financeData.profit.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {financeData.profit.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{financeData.profit.trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
}