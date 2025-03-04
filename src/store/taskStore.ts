import delay from "delay";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface Task {
  id: string;
  name: string;
  createdAt: Date;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  setSearchTerm: (term: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      searchTerm: "",

      addTask: async (task) => {
        set({ isLoading: true });
        await delay(800);

        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
          isLoading: false,
        }));
      },

      deleteTask: async (id) => {
        set({ isLoading: true });
        await delay(800);

        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          isLoading: false,
        }));
      },

      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: "task-storage",
      partialize: (state) => ({
        tasks: state.tasks,
        searchTerm: state.searchTerm,
      }),
    }
  )
);
