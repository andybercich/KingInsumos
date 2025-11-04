import { create } from "zustand";

interface IPaginadorStore {
  numeroPagina: number;
  getNumeroPagina: () => number;
  setNumeroPagina: (numero: number) => void;
  recargar: boolean;
  getRecargar: () => boolean;
  setRecargar: (recar: boolean) => void;
}

export const paginadorStore = create<IPaginadorStore>((set, get) => ({
  numeroPagina: 1,

  getNumeroPagina: () => get().numeroPagina,

  setNumeroPagina: (numero) => set(() => ({ numeroPagina: numero })),
  recargar: false,

  getRecargar: () => get().recargar,

  setRecargar: (recar) => set(() => ({ recargar: recar })),

}));