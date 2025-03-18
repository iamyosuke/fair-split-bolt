import { create } from 'zustand';
import type { Group, Expense } from '@prisma/client';
import {
  fetchGroups,
  fetchGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  createExpense,
  fetchExpenses,
  deleteExpense,
  updateExpense
} from '@/lib/api';

interface GroupStore {
  groups: Group[];
  currentGroup: Group | null;
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  fetchAllGroups: () => Promise<void>;
  fetchGroupById: (id: string) => Promise<void>;
  addGroup: (data: Partial<Group>) => Promise<void>;
  editGroup: (id: string, data: Partial<Group>) => Promise<void>;
  removeGroup: (id: string) => Promise<void>;
  addExpense: (data: Partial<Expense>) => Promise<void>;
  editExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  fetchGroupExpenses: (groupId: string) => Promise<void>;
  reset: () => void;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  currentGroup: null,
  expenses: [],
  loading: false,
  error: null,

  fetchAllGroups: async () => {
    set({ loading: true, error: null });
    try {
      const groups = await fetchGroups();
      set({ groups, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchGroupById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const group = await fetchGroup(id);
      set({ currentGroup: group, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addGroup: async (data: Partial<Group>) => {
    set({ loading: true, error: null });
    try {
      const newGroup = await createGroup(data);
      set(state => ({
        groups: [...state.groups, newGroup],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  editGroup: async (id: string, data: Partial<Group>) => {
    set({ loading: true, error: null });
    try {
      const updatedGroup = await updateGroup(id, data);
      set(state => ({
        groups: state.groups.map(g => g.id === id ? updatedGroup : g),
        currentGroup: state.currentGroup?.id === id ? updatedGroup : state.currentGroup,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeGroup: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteGroup(id);
      set(state => ({
        groups: state.groups.filter(g => g.id !== id),
        currentGroup: state.currentGroup?.id === id ? null : state.currentGroup,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addExpense: async (data: Partial<Expense>) => {
    set({ loading: true, error: null });
    try {
      const newExpense = await createExpense(data);
      set(state => ({
        expenses: [...state.expenses, newExpense],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  editExpense: async (id: string, data: Partial<Expense>) => {
    set({ loading: true, error: null });
    try {
      const updatedExpense = await updateExpense(id, data);
      set(state => ({
        expenses: state.expenses.map(e => e.id === id ? updatedExpense : e),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeExpense: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteExpense(id);
      set(state => ({
        expenses: state.expenses.filter(e => e.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchGroupExpenses: async (groupId: string) => {
    set({ loading: true, error: null });
    try {
      const expenses = await fetchExpenses(groupId);
      set({ expenses, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  reset: () => {
    set({
      groups: [],
      currentGroup: null,
      expenses: [],
      loading: false,
      error: null
    });
  }
}));