import { ExpenseWithDetails, Balance, Settlement } from '../types/database';

export function calculateBalances(expenses: ExpenseWithDetails[]): Balance[] {
  const balanceMap = new Map<string, Balance>();

  expenses.forEach(expense => {
    if (!balanceMap.has(expense.paid_by)) {
      balanceMap.set(expense.paid_by, {
        userId: expense.paid_by,
        userName: expense.payer.name,
        userColor: expense.payer.color,
        balance: 0
      });
    }

    const payerBalance = balanceMap.get(expense.paid_by)!;
    payerBalance.balance += expense.amount;

    expense.splits.forEach(split => {
      if (!balanceMap.has(split.user_id)) {
        balanceMap.set(split.user_id, {
          userId: split.user_id,
          userName: split.user.name,
          userColor: split.user.color,
          balance: 0
        });
      }

      const userBalance = balanceMap.get(split.user_id)!;
      userBalance.balance -= split.amount;
    });
  });

  return Array.from(balanceMap.values());
}

export function calculateSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];
  const creditors = balances.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.balance, -debtor.balance);

    settlements.push({
      from: debtor.userId,
      fromName: debtor.userName,
      to: creditor.userId,
      toName: creditor.userName,
      amount: Math.round(amount * 100) / 100
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance < 0.01) i++;
    if (debtor.balance > -0.01) j++;
  }

  return settlements;
}
