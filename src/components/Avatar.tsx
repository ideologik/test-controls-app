import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

const avatarModels = {
  male_04: "./assets/avatars/SK_Custom_male_04.glb",
  male_13: "./assets/avatars/SK_Custom_male_13.glb",
  female_07: "./assets/avatars/SK_Custom_female_07.glb",
  female_09: "./assets/avatars/SK_Custom_female_09.glb",
};

const Avatar: React.FC<JSX.IntrinsicElements["group"]> = ({ ...props }) => {
  const groupRef = useRef<THREE.Group>(null);
  const avatarRef = useRef(null);
  const { scene } = useGLTF(avatarModels["male_04"]);
  const clone = SkeletonUtils.clone(scene);
  useGLTF("./assets/avatars/Animations.glb");

  return (
    <group ref={groupRef} {...props}>
      <primitive object={clone} ref={avatarRef} />
    </group>
  );
};

export default Avatar;
