import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { User, ExpenseWithDetails, Balance, Settlement } from './types/database';
import { calculateBalances, calculateSettlements } from './utils/calculations';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import { Users } from 'lucide-react';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    loadExpenses();
  }, []);

  useEffect(() => {
    const calculatedBalances = calculateBalances(expenses);
    setBalances(calculatedBalances);
    setSettlements(calculateSettlements(calculatedBalances));
  }, [expenses]);

  async function loadUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading users:', error);
      return;
    }

    setUsers(data || []);
  }

  async function loadExpenses() {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        payer:users!expenses_paid_by_fkey(*),
        splits:expense_splits(
          *,
          user:users(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      setLoading(false);
      return;
    }

    setExpenses(data as ExpenseWithDetails[] || []);
    setLoading(false);
  }

  async function handleAddExpense(expense: {
    description: string;
    amount: number;
    paidBy: string;
    splitType: 'equal' | 'custom';
    customSplits?: Record<string, number>;
  }) {
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        paid_by: expense.paidBy
      })
      .select()
      .single();

    if (expenseError) {
      console.error('Error adding expense:', expenseError);
      alert('Failed to add expense');
      return;
    }

    const splits = expense.splitType === 'equal'
      ? users.map(user => ({
          expense_id: expenseData.id,
          user_id: user.id,
          amount: expense.amount / users.length
        }))
      : users.map(user => ({
          expense_id: expenseData.id,
          user_id: user.id,
          amount: expense.customSplits?.[user.id] || 0
        })).filter(split => split.amount > 0);

    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splits);

    if (splitsError) {
      console.error('Error adding expense splits:', splitsError);
      alert('Failed to add expense splits');
      return;
    }

    loadExpenses();
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
      return;
    }

    loadExpenses();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Users size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Expense Splitter</h1>
          </div>
          <p className="text-gray-600">Manage shared expenses with friends</p>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-600">Group Members:</span>
            {users.map(user => (
              <div
                key={user.id}
                className="flex items-center space-x-2 px-3 py-1 rounded-full"
                style={{ backgroundColor: user.color + '20' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <AddExpenseForm users={users} onAddExpense={handleAddExpense} />
          <BalanceSummary balances={balances} settlements={settlements} />
        </div>

        <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
      </div>
    </div>
  );
}

export default App;
