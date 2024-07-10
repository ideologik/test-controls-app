import { useEffect } from "react";
import { useAnimations } from "@react-three/drei";
import * as THREE from "three";
import usePlayerStore from "../../../../stores/usePlayerStore";

const useRemoteAnimations = (
  avatarRef: React.RefObject<any>,
  animations: THREE.AnimationClip[]
) => {
  console.log("avatarRef", avatarRef);
  const { actions, names } = useAnimations(animations, avatarRef);
  const animation = usePlayerStore((state) => state.animation);
};

export default useRemoteAnimations;
