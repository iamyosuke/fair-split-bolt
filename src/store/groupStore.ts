import { create } from 'zustand';
import { Currency, Group, Member } from '../types';

interface GroupState {
  groups: Group[];
  createGroup: (name: string, currency: Currency, members: Member[]) => Group;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  createGroup: (name, currency, members) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      currency,
      members,
      createdAt: new Date(),
    };

    set((state) => ({
      groups: [...state.groups, newGroup],
    }));

    return newGroup;
  },
}));