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
