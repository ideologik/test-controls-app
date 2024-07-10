import React, { useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { cloneDeep } from "lodash";

type AvatarProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
  animation: string | null;
};

const Avatar: React.FC<AvatarProps> = ({
  modelUrl,
  animation = "Idle",
  ...props
}) => {
  console.log("render Avatar");
  const avatarRef = useRef<THREE.Group>(null);

  const { scene: avatarScene, animations } = useGLTF(modelUrl);
  const avatarClone = SkeletonUtils.clone(avatarScene);
  //const { animations } = useGLTF("./assets/avatars/Animations.glb");
  // const cloneAnimations = cloneDeep(animations);
  const { actions, names } = useAnimations(animations, avatarRef);

  useEffect(() => {
    if (animation && actions && actions[animation]) {
      console.log("entre al useEffect", animation);
      const action = actions[animation]?.reset().fadeIn(0.5).play();
      return () => {
        if (actions["Idle"]) {
          action?.fadeOut(0.5);
        }
      };
    }
  }, [animation, actions, names]);

  return <primitive {...props} object={avatarClone} ref={avatarRef} />;
};

export default Avatar;
