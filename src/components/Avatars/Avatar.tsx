import React, { useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { currentAnimationAtom } from "../../playerStateStore";
import { useAtom } from "jotai";

const avatarModels = {
  male_04: "./assets/avatars/SK_Custom_male_04.glb",
  male_13: "./assets/avatars/SK_Custom_male_13.glb",
  female_07: "./assets/avatars/SK_Custom_female_07.glb",
  female_09: "./assets/avatars/SK_Custom_female_09.glb",
  robot: "./assets/avatars/jaxa_iss_int-ball.glb",
};

type AvatarProps = JSX.IntrinsicElements["group"] & {
  animationUrl?: string | null;
};

const Avatar: React.FC<AvatarProps> = ({ animationUrl = null, ...props }) => {
  console.log("render Avatar");
  const groupRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF(avatarModels["male_04"]);
  const clone = SkeletonUtils.clone(scene);

  const animationGLTF = useGLTF(animationUrl || avatarModels["male_04"]);
  const animations = animationUrl ? animationGLTF.animations : [];
  const { actions, names } = useAnimations(animations, avatarRef);

  const [currentAnimation] = useAtom(currentAnimationAtom);

  useEffect(() => {
    if (
      animationUrl &&
      currentAnimation &&
      actions &&
      actions[currentAnimation]
    ) {
      console.log("entre al useEffect", actions[currentAnimation]);
      const action = actions[currentAnimation]?.reset().fadeIn(0.5).play();
      return () => {
        if (actions["Idle"]) {
          action?.fadeOut(0.5);
        }
      };
    }
  }, [animationUrl, actions, currentAnimation, names]);

  return (
    <group
      ref={groupRef}
      {...props}
      position={props.position ? props.position : [0, -0.96, 0]}
    >
      <primitive object={clone} ref={avatarRef} />
    </group>
  );
};
export default Avatar;
