import { Balance, Settlement } from '../types/database';
import { ArrowRight, DollarSign } from 'lucide-react';

interface BalanceSummaryProps {
  balances: Balance[];
  settlements: Settlement[];
}

export default function BalanceSummary({ balances, settlements }: BalanceSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Balances</h2>
        {balances.length === 0 ? (
          <p className="text-gray-500 text-center">No balances to show yet.</p>
        ) : (
          <div className="space-y-3">
            {balances.map(balance => (
              <div
                key={balance.userId}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: balance.userColor }}
                  >
                    {balance.userName.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-800">{balance.userName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {balance.balance > 0.01 ? (
                    <span className="text-green-600 font-bold">
                      +${balance.balance.toFixed(2)}
                    </span>
                  ) : balance.balance < -0.01 ? (
                    <span className="text-red-600 font-bold">
                      -${Math.abs(balance.balance).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-500 font-bold">$0.00</span>
                  )}
                  {balance.balance > 0.01 && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      gets back
                    </span>
                  )}
                  {balance.balance < -0.01 && (
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      owes
                    </span>
                  )}
                  {Math.abs(balance.balance) <= 0.01 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      settled up
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Settlement Summary</h2>
        {settlements.length === 0 ? (
          <div className="text-center py-6">
            <DollarSign size={48} className="mx-auto mb-2 text-green-500" />
            <p className="text-green-600 font-medium">Everyone is settled up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">
                    {settlement.fromName}
                  </span>
                  <ArrowRight className="text-blue-500" size={20} />
                  <span className="font-semibold text-gray-800">
                    {settlement.toName}
                  </span>
                </div>
                <div className="text-xl font-bold text-green-600">
                  ${settlement.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
