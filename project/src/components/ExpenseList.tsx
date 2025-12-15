import { ExpenseWithDetails } from '../types/database';
import { Receipt, Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseWithDetails[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <Receipt size={48} className="mx-auto mb-2 opacity-50" />
        <p>No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Transaction History</h2>
      <div className="space-y-3">
        {expenses.map(expense => (
          <div
            key={expense.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {expense.description}
                </h3>
                <p className="text-sm text-gray-600">
                  Paid by{' '}
                  <span
                    className="font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: expense.payer.color + '20',
                      color: expense.payer.color
                    }}
                  >
                    {expense.payer.name}
                  </span>
                  {' '}on {new Date(expense.expense_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-xl font-bold text-gray-800">
                  ${expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete expense"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Split among:</p>
              <div className="flex flex-wrap gap-2">
                {expense.splits.map(split => (
                  <span
                    key={split.user_id}
                    className="text-sm px-2 py-1 rounded"
                    style={{
                      backgroundColor: split.user.color + '20',
                      color: split.user.color
                    }}
                  >
                    {split.user.name}: ${split.amount.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
