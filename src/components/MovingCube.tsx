import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { playerStateAtom } from "../playerStateStore";
import * as THREE from "three";

const MovingCube: React.FC = () => {
  const [playerState] = useAtom(playerStateAtom);
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (cubeRef.current) {
      const currentPos = cubeRef.current.position;
      const currentRot = cubeRef.current.quaternion;

      const targetPos = new THREE.Vector3(
        playerState.position.x + 1.5,
        playerState.position.y + 0,
        playerState.position.z + 1.5
      );

      const targetRot = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          playerState.rotation.x,
          playerState.rotation.y,
          playerState.rotation.z
        )
      );

      // Interpolate position
      currentPos.lerp(targetPos, 0.1);
      cubeRef.current.position.set(currentPos.x, currentPos.y, currentPos.z);

      // Interpolate rotation
      currentRot.slerp(targetRot, 0.1);
      cubeRef.current.quaternion.set(
        currentRot.x,
        currentRot.y,
        currentRot.z,
        currentRot.w
      );
    }
  });

  return (
    <>
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <mesh position={[0, 0.55, 0.45]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </mesh>
    </>
  );
};

export default React.memo(MovingCube);
