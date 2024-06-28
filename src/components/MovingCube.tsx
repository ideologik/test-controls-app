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
      // Obtener la posición y rotación actuales del cubo
      const currentPos = cubeRef.current.position;
      const currentRot = cubeRef.current.quaternion;

      // Crear las posiciones y rotaciones objetivo basadas en el estado del jugador
      const targetPos = new THREE.Vector3(
        playerState.position.x + 1.5, // Ajusta esto según sea necesario
        playerState.position.y,
        playerState.position.z + 1.5 // Ajusta esto según sea necesario
      );

      const targetRot = new THREE.Quaternion(
        playerState.rotation.x,
        playerState.rotation.y,
        playerState.rotation.z,
        playerState.rotation.w
      );

      // Interpolar la posición y rotación
      currentPos.lerp(targetPos, 0.1);
      cubeRef.current.position.set(currentPos.x, currentPos.y, currentPos.z);

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
    <mesh ref={cubeRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
      <mesh position={[0, 0.55, 0.45]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </mesh>
  );
};

export default React.memo(MovingCube);
