'use client';
import { create } from 'zustand';

interface CanvasSidebarState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCanvasSidebarStore = create<CanvasSidebarState>((set: (partial: Partial<CanvasSidebarState>) => void) => ({
  open: true,
  setOpen: (open: boolean) => set({ open }),
})); 