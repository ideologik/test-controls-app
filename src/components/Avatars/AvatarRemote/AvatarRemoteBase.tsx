import React, { useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import usePlayerStore from "../../../stores/usePlayerStore";

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

const AvatarRemoteBase: React.FC<AvatarProps> = ({
  animationUrl = null,
  ...props
}) => {
  console.log("render AvatarRemoteBase");
  const groupRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Group>(null);

  const { scene: avatarScene } = useGLTF(avatarModels["male_04"]);
  const avatarClone = SkeletonUtils.clone(avatarScene);

  // Load animations if animationUrl is provided
  const animationGLTF = useGLTF(animationUrl || avatarModels["male_04"]);
  const animations = animationUrl
    ? animationGLTF.animations.map((animation) => animation.clone())
    : [];

  const { actions, names } = useAnimations(animations, avatarRef);

  const currentAnimation = usePlayerStore((state) => state.animation);

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
      <primitive object={avatarClone} ref={avatarRef} />
    </group>
  );
};
export default AvatarRemoteBase;
