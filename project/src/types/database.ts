export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          color?: string;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          description: string;
          amount: number;
          paid_by: string;
          expense_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          amount: number;
          paid_by: string;
          expense_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          amount?: number;
          paid_by?: string;
          expense_date?: string;
          created_at?: string;
        };
      };
      expense_splits: {
        Row: {
          id: string;
          expense_id: string;
          user_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          user_id: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_id?: string;
          user_id?: string;
          amount?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type ExpenseSplit = Database['public']['Tables']['expense_splits']['Row'];

export interface ExpenseWithDetails extends Expense {
  payer: User;
  splits: (ExpenseSplit & { user: User })[];
}

export interface Balance {
  userId: string;
  userName: string;
  userColor: string;
  balance: number;
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}
