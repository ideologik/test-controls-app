import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { cloneDeep } from "lodash";
import * as THREE from "three";
import usePlayerStore from "../../../stores/usePlayerStore";

// Definimos el tipo del evento
type AnimationEvent = {
  type: string;
  action: THREE.AnimationAction;
};

const useRemoteAnimations = (avatarRef: React.RefObject<THREE.Group>) => {
  const { animations } = useGLTF("./assets/avatars/Animations.glb");
  const cloneAnimations = cloneDeep(animations);
  const { actions, names, mixer } = useAnimations(cloneAnimations, avatarRef);
  const animation = usePlayerStore((state) => state.animation);
  const prevAnimation = useRef<string | null>(null);

  useEffect(() => {
    if (
      animation &&
      actions &&
      actions[animation] &&
      prevAnimation.current !== animation
    ) {
      console.log("entre al useEffect", animation);
      const action = actions[animation]?.reset().fadeIn(0.5).play();
      prevAnimation.current = animation;

      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;

      // Listener para el evento de terminación de la animación
      const onAnimationFinished = (event: AnimationEvent) => {
        if (event.action === action && actions["Idle"]) {
          actions["Idle"]?.fadeIn(0.5).play();
          prevAnimation.current = "Idle";
        }
      };

      mixer.addEventListener("finished", onAnimationFinished);

      return () => {
        mixer.removeEventListener("finished", onAnimationFinished);
      };
    }
  }, [animation, actions, names, mixer]);
};

export default useRemoteAnimations;
