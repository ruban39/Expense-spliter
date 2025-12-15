import { useState } from 'react';
import { User } from '../types/database';
import { PlusCircle } from 'lucide-react';

interface AddExpenseFormProps {
  users: User[];
  onAddExpense: (expense: {
    description: string;
    amount: number;
    paidBy: string;
    splitType: 'equal' | 'custom';
    customSplits?: Record<string, number>;
  }) => void;
}

export default function AddExpenseForm({ users, onAddExpense }: AddExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !paidBy) {
      alert('Please fill in all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const customSplitsNum: Record<string, number> = {};
    if (splitType === 'custom') {
      let total = 0;
      for (const userId in customSplits) {
        const splitAmount = parseFloat(customSplits[userId] || '0');
        if (isNaN(splitAmount) || splitAmount < 0) {
          alert('Please enter valid split amounts');
          return;
        }
        customSplitsNum[userId] = splitAmount;
        total += splitAmount;
      }
      if (Math.abs(total - amountNum) > 0.01) {
        alert(`Custom splits must add up to ${amountNum}. Current total: ${total.toFixed(2)}`);
        return;
      }
    }

    onAddExpense({
      description,
      amount: amountNum,
      paidBy,
      splitType,
      customSplits: splitType === 'custom' ? customSplitsNum : undefined
    });

    setDescription('');
    setAmount('');
    setPaidBy('');
    setSplitType('equal');
    setCustomSplits({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Hotel accommodation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paid By
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a person</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Split Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="equal"
                checked={splitType === 'equal'}
                onChange={(e) => setSplitType(e.target.value as 'equal')}
                className="mr-2"
              />
              Equal Split
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="custom"
                checked={splitType === 'custom'}
                onChange={(e) => setSplitType(e.target.value as 'custom')}
                className="mr-2"
              />
              Custom Split
            </label>
          </div>
        </div>

        {splitType === 'custom' && amount && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Custom Split Amounts (Total: ${parseFloat(amount || '0').toFixed(2)})
            </p>
            {users.map(user => (
              <div key={user.id} className="flex items-center space-x-2 mb-2">
                <label className="w-24 text-sm">{user.name}:</label>
                <input
                  type="number"
                  step="0.01"
                  value={customSplits[user.id] || ''}
                  onChange={(e) => setCustomSplits({
                    ...customSplits,
                    [user.id]: e.target.value
                  })}
                  placeholder="0.00"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Add Expense</span>
        </button>
      </form>
    </div>
  );
}
