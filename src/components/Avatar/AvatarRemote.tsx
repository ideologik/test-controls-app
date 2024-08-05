import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import usePlayerStore, {
  selectPosition,
  selectRotation,
  selectAnimation,
} from "../../stores/usePlayerStore";

type AvatarRemoteProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
  animationsUrl: string;
};

const AvatarRemote: React.FC<AvatarRemoteProps> = ({
  modelUrl,
  animationsUrl,
  ...props
}) => {
  console.log("entre xxx al AvatarRemote");
  const groupRef = useRef<THREE.Group>(null);
  const avatarRef = useRef<THREE.Group>(null);

  const position = usePlayerStore(selectPosition);
  const rotation = usePlayerStore(selectRotation);

  const lerpPosition = useRef(new THREE.Vector3());
  const slerpRotation = useRef(new THREE.Quaternion());

  useFrame((_, delta) => {
    if (groupRef.current && position && rotation) {
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

  const modelGLTF = useGLTF(modelUrl);
  const avatarClone = SkeletonUtils.clone(modelGLTF.scene);

  // Carga las animaciones GLTF desde la URL proporcionada o desde el modelo si no se proporciona una URL específica
  const animationsGLTF = useGLTF(animationsUrl || modelUrl);
  const animations = animationsUrl
    ? animationsGLTF.animations
    : modelGLTF.animations;

  const { actions, names } = useAnimations(animations, avatarRef);

  const [animation, setAnimation] = useState("Idle");

  const animationState = usePlayerStore(selectAnimation);
  useEffect(() => {
    setAnimation(animationState);
  }, [animationState]);

  useEffect(() => {
    if (animation && actions && actions[animation]) {
      console.log("entre xxx al useEffect", animation);
      const action = actions[animation]?.reset().fadeIn(0.5).play();
      return () => {
        if (actions["Idle"]) {
          action?.fadeOut(0.5);
        }
      };
    }
  }, [animation, actions, names]);

  return (
    <group ref={groupRef}>
      <primitive object={avatarClone} {...props} ref={avatarRef} />
    </group>
  );
};

export default AvatarRemote;
