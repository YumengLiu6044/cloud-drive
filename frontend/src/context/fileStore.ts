import { mockFiles } from "@/constants";
import type { File, FileStore } from "@/type";
import { create } from "zustand";

export const useFileStore = create<FileStore>((set) => ({
  files: mockFiles,
  setFiles: (newFiles: File[]) => {
    set({
      files: newFiles
    })
  }
}))