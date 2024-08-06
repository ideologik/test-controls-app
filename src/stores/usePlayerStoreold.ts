import { create } from "zustand";
import * as THREE from "three";

export type IAvatarAnimation =
  | "Idle"
  | "Walk"
  | "Run"
  | "Jump_Start"
  | "Jump_Idle"
  | "Jump_Land";

export type IAvatarModel = "male_04" | "male_13" | "female_07" | "female_09";

export interface IAvatarPinCoordinates {
  [model: string]: THREE.Vector3;
}

// Define las coordenadas de los pines por modelo
export const avatarPinCoordinates: IAvatarPinCoordinates = {
  male_04: new THREE.Vector3(0.2, -0.09, 0.14),
  male_13: new THREE.Vector3(0.14, -0.15, 0.23),
  female_07: new THREE.Vector3(0.2, -0.05, 0.14),
  female_09: new THREE.Vector3(0.22, -0.1, 0.13),
};

export interface IAvatarProperties {
  id: string;
  nickName?: string;
  model: IAvatarModel;
  hairColor?: string;
  skinColor?: string;
  eyeColor?: string;
  mouthColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  room?: "blue" | "red" | "lobby";
}

export interface IAvatarState {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  animation: IAvatarAnimation;
  avatarProperties: IAvatarProperties;
  setPosition: (newPos: THREE.Vector3) => void;
  setRotation: (newQuat: THREE.Quaternion) => void;
  setAnimation: (newAnimation: IAvatarAnimation) => void;
  setAvatarProperties: (newProperties: Partial<IAvatarProperties>) => void;
}

// Define el estado inicial
const initialAvatarState: Omit<
  IAvatarState,
  "setPosition" | "setRotation" | "setAnimation" | "setAvatarProperties"
> = {
  position: new THREE.Vector3(),
  rotation: new THREE.Quaternion(),
  animation: "Idle",
  avatarProperties: {
    id: "",
    model: "male_04",
  },
};

// Crea la tienda usando Zustand
const usePlayerStore = create<{
  avatars: IAvatarState[];
  addAvatar: (avatar: IAvatarState) => void;
  updateAvatar: (id: string, updatedProperties: Partial<IAvatarState>) => void;
  filterByRoom: (room: "blue" | "red" | "lobby") => IAvatarState[];
}>((set, get) => ({
  ...initialAvatarState,
  avatars: [],
  addAvatar: (avatar: IAvatarState) =>
    set((state) => ({ avatars: [...state.avatars, avatar] })),
  updateAvatar: (id: string, updatedProperties: Partial<IAvatarState>) =>
    set((state) => ({
      avatars: state.avatars.map((avatar) =>
        avatar.avatarProperties.id === id
          ? { ...avatar, ...updatedProperties }
          : avatar
      ),
    })),
  filterByRoom: (room: "blue" | "red" | "lobby") =>
    get().avatars.filter((avatar) => avatar.avatarProperties.room === room),
}));

// Selectores personalizados
export const selectPosition = (state: IAvatarState) => state.position;
export const selectRotation = (state: IAvatarState) => state.rotation;
export const selectAnimation = (state: IAvatarState) => state.animation;
export const selectAvatarProperties = (state: IAvatarState) =>
  state.avatarProperties;
export const selectAvatars = (state: { avatars: IAvatarState[] }) =>
  state.avatars;
export const selectAvatarById =
  (id: string) => (state: { avatars: IAvatarState[] }) =>
    state.avatars.find((avatar) => avatar.avatarProperties.id === id);

export default usePlayerStore;
