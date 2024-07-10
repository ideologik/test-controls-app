import { create } from "zustand";
import * as THREE from "three";

export type IAvatarAnimation =
  | "Idle"
  | "Walk"
  | "Run"
  | "Jump_Start"
  | "Jump_Idle"
  | "Jump_Land";

export interface IAvatarState {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  animation: IAvatarAnimation;
  setPosition: (newPos: THREE.Vector3) => void;
  setRotation: (newQuat: THREE.Quaternion) => void;
  setAnimation: (newAnimation: IAvatarAnimation) => void;
}

// Define el estado inicial
const initialAvatarState: Omit<
  IAvatarState,
  "setPosition" | "setRotation" | "setAnimation"
> = {
  position: new THREE.Vector3(),
  rotation: new THREE.Quaternion(),
  animation: "Idle",
};

// Crea la tienda usando Zustand
const usePlayerStore = create<IAvatarState>((set) => ({
  ...initialAvatarState,
  setPosition: (newPos: THREE.Vector3) =>
    set((state) => {
      if (!state.position.equals(newPos)) {
        return { ...state, position: newPos };
      }
      return state;
    }),
  setRotation: (newQuat: THREE.Quaternion) =>
    set((state) => {
      if (!state.rotation.equals(newQuat)) {
        return { ...state, rotation: newQuat };
      }
      return state;
    }),
  setAnimation: (newAnimation: IAvatarAnimation) =>
    set(() => ({
      animation: newAnimation,
    })),
}));

// Selectores personalizados
export const selectPosition = (state: IAvatarState) => state.position;
export const selectRotation = (state: IAvatarState) => state.rotation;
export const selectAnimation = (state: IAvatarState) => state.animation;

export default usePlayerStore;
