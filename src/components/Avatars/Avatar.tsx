import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

type AvatarProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
  animationsUrl?: string | null;
  animation?: string | null;
};

export interface AvatarHandle {
  setAnimation: (animationName: string) => void;
}

const DEFAULT_ANIMATION = "Idle";

const Avatar = forwardRef<AvatarHandle, AvatarProps>(
  (
    { modelUrl, animationsUrl = null, animation = DEFAULT_ANIMATION, ...props },
    ref
  ) => {
    console.log("render Avatar");
    const avatarRef = useRef<THREE.Group>(null);
    const currentAnimation = useRef(animation);
    const action = useRef<THREE.AnimationAction | undefined>(undefined);

    // Carga el modelo y sus animaciones
    const modelGLTF = useGLTF(modelUrl);
    const { scene: avatarScene } = modelGLTF;
    const avatarClone = useRef(SkeletonUtils.clone(avatarScene)).current;

    // Carga las animaciones desde animationsUrl si está presente, o usa las animaciones del modelo
    const animationsGLTF = useGLTF(animationsUrl || modelUrl);
    const animations = animationsUrl
      ? animationsGLTF.animations
      : modelGLTF.animations;

    const { actions } = useAnimations(animations, avatarRef);

    useImperativeHandle(ref, () => ({
      setAnimation: (animationName: string) => {
        if (actions && actions[animationName]) {
          console.log("cambiar a animación", animationName);
          currentAnimation.current = animationName;
          action.current?.fadeOut(0.5);
          action.current = actions[animationName]?.reset().fadeIn(0.5).play();
        }
      },
    }));

    useEffect(() => {
      if (actions && currentAnimation.current) {
        console.log("entre al useEffect", currentAnimation.current);
        action.current = actions[currentAnimation.current]?.reset().play();
        return () => {
          action.current?.fadeOut(0.5);
        };
      }
    }, [actions]);

    return <primitive {...props} object={avatarClone} ref={avatarRef} />;
  }
);

export default Avatar;
