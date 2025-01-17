import { create } from 'zustand';
import { ExecutionStore, QueryExecution } from '../types/execution';
import { v4 as uuidv4 } from 'uuid';

export const useExecutions = create<ExecutionStore>((set) => ({
  activeExecutions: [],
  completedExecutions: [],
  addExecution: (execution: Omit<QueryExecution, 'id' | 'startTime'>) => {
    const newExecution = {
      ...execution,
      id: uuidv4(),
      startTime: new Date(),
    };
    set((state) => ({
      activeExecutions: [...state.activeExecutions, newExecution],
    }));
    return newExecution.id;
  },
  completeExecution: (id: string, status: 'completed' | 'failed') => {
    set((state) => {
      const execution = state.activeExecutions.find((e) => e.id === id);
      if (!execution) return state;

      return {
        activeExecutions: state.activeExecutions.filter((e) => e.id !== id),
        completedExecutions: [...state.completedExecutions, { ...execution, status }],
      };
    });
  },
}));