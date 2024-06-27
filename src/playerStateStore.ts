import { atom } from "jotai";

export interface IAvatarState {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}
export const playerStateAtom = atom<IAvatarState>({
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
});