import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import AvatarModel from "./AvatarModel";
import usePlayerStore, {
  selectPosition,
  selectRotation,
  selectAnimation,
} from "../../stores/usePlayerStore";

type AvatarRemoteProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarRemote: React.FC<AvatarRemoteProps> = ({ modelUrl, ...props }) => {
  const groupRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Group>(null);

  const position = usePlayerStore(selectPosition);
  const rotation = usePlayerStore(selectRotation);

  const lerpPosition = useRef(new THREE.Vector3());
  const slerpRotation = useRef(new THREE.Quaternion());

  useFrame((_, delta) => {
    if (groupRef.current && avatarRef.current && position && rotation) {
      // Interpolación suave para la posición
      lerpPosition.current.lerp(position, delta * 5); // Ajusta el factor de interpolación según sea necesario
      groupRef.current.position.copy(lerpPosition.current);

      // Interpolación suave para la rotación
      slerpRotation.current.slerpQuaternions(
        groupRef.current.quaternion,
        rotation,
        delta * 5
      ); // Ajusta el factor de interpolación según sea necesario
      groupRef.current.quaternion.copy(slerpRotation.current);
    }
  });

  const { animations } = useGLTF(modelUrl);

  const { actions, names } = useAnimations(animations, avatarRef);

  const [animation, setAnimation] = useState("Idle");

  const animationState = usePlayerStore(selectAnimation);
  useEffect(() => {
    setAnimation(animationState);
  }, [animationState]);

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

  return (
    <group ref={groupRef} {...props}>
      <AvatarModel modelUrl={modelUrl} ref={avatarRef} />
    </group>
  );
};

export default AvatarRemote;
