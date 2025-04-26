import { create } from "zustand";

type ParsedData = {
  bank?: string;
  income?: string;
  savings?: string;
  personal?: string;
};

interface UploadStore {
  parsedData: ParsedData;
  setParsedData: (data: ParsedData) => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  parsedData: {},
  setParsedData: (data) => set({ parsedData: data }),
}));
