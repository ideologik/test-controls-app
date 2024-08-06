import { create } from "zustand";
import * as THREE from "three";
import { IAvatarState, IAvatarProperties, IAvatarAnimation } from "./types";

const initialLocalAvatarState: Omit<
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

const usePlayerStore = create<{
  localAvatar: IAvatarState;
  setLocalAvatarPosition: (newPos: THREE.Vector3) => void;
  setLocalAvatarRotation: (newQuat: THREE.Quaternion) => void;
  setLocalAvatarAnimation: (newAnimation: IAvatarAnimation) => void;
  setLocalAvatarProperties: (newProperties: Partial<IAvatarProperties>) => void;
}>((set) => ({
  localAvatar: {
    ...initialLocalAvatarState,
    setPosition: (newPos: THREE.Vector3) =>
      set((state) => {
        if (!state.localAvatar.position.equals(newPos)) {
          return { localAvatar: { ...state.localAvatar, position: newPos } };
        }
        return state;
      }),
    setRotation: (newQuat: THREE.Quaternion) =>
      set((state) => {
        if (!state.localAvatar.rotation.equals(newQuat)) {
          return { localAvatar: { ...state.localAvatar, rotation: newQuat } };
        }
        return state;
      }),
    setAnimation: (newAnimation: IAvatarAnimation) =>
      set((state) => ({
        localAvatar: { ...state.localAvatar, animation: newAnimation },
      })),
    setAvatarProperties: (newProperties: Partial<IAvatarProperties>) =>
      set((state) => ({
        localAvatar: {
          ...state.localAvatar,
          avatarProperties: {
            ...state.localAvatar.avatarProperties,
            ...newProperties,
          },
        },
      })),
  },
  setLocalAvatarPosition: (newPos: THREE.Vector3) =>
    set((state) => {
      if (!state.localAvatar.position.equals(newPos)) {
        return { localAvatar: { ...state.localAvatar, position: newPos } };
      }
      return state;
    }),
  setLocalAvatarRotation: (newQuat: THREE.Quaternion) =>
    set((state) => {
      if (!state.localAvatar.rotation.equals(newQuat)) {
        return { localAvatar: { ...state.localAvatar, rotation: newQuat } };
      }
      return state;
    }),
  setLocalAvatarAnimation: (newAnimation: IAvatarAnimation) =>
    set((state) => ({
      localAvatar: { ...state.localAvatar, animation: newAnimation },
    })),
  setLocalAvatarProperties: (newProperties: Partial<IAvatarProperties>) =>
    set((state) => ({
      localAvatar: {
        ...state.localAvatar,
        avatarProperties: {
          ...state.localAvatar.avatarProperties,
          ...newProperties,
        },
      },
    })),
}));

// Selectores personalizados
export const selectLocalAvatar = (state: { localAvatar: IAvatarState }) =>
  state.localAvatar;

export default usePlayerStore;
