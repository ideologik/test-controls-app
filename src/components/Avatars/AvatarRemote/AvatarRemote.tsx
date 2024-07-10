import React, { useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import usePlayerStore, {
  selectPosition,
  selectRotation,
} from "../../../stores/usePlayerStore";

//import useRemoteAnimations from "./useRemoteAnimations";

type AvatarRemoteProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarRemote: React.FC<AvatarRemoteProps> = ({ modelUrl, ...props }) => {
  console.log("AvatarRemote");
  const avatarRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { scene: avatarScene, animations } = useGLTF(modelUrl);
  const avatarClone = SkeletonUtils.clone(avatarScene);

  //const { animations } = useGLTF("./assets/avatars/Animations.glb");
  // const cloneAnimations = cloneDeep(animations);
  const { actions, names } = useAnimations(animations, avatarRef);

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

  return (
    <group ref={groupRef} {...props}>
      <primitive object={avatarClone} ref={avatarRef} />
    </group>
  );
};

export default AvatarRemote;
