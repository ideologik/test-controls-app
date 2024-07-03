// usePlayerState Hook
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import usePlayerStore, {
  IAvatarAnimation,
} from "../../../../stores/usePlayerStore";
import { useGame } from "ecctrl";

const usePlayerState = (rigidBodyRef: React.RefObject<RapierRigidBody>) => {
  const setPosition = usePlayerStore((state) => state.setPosition);
  const setRotation = usePlayerStore((state) => state.setRotation);
  const setAnimation = usePlayerStore((state) => state.setAnimation);

  const lastPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastRotationRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  console.log("usePlayerState render");

  const animation = usePlayerStore((state) => state.animation);
  const roundValue = useCallback((value: number, precision: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }, []);

  const curAnimation = useGame((state) => state.curAnimation);

  useFrame(() => {

    if (curAnimation !== animation) {
      setAnimation(curAnimation as IAvatarAnimation);
    }
    
    if (rigidBodyRef.current) {
      // Calcular la posición y rotación actuales
      const currentPosition = new THREE.Vector3(
        roundValue(rigidBodyRef.current.translation().x, 2),
        roundValue(rigidBodyRef.current.translation().y, 2),
        roundValue(rigidBodyRef.current.translation().z, 2)
      );

      const currentRotation = new THREE.Quaternion(
        roundValue(rigidBodyRef.current.rotation().x, 2),
        roundValue(rigidBodyRef.current.rotation().y, 2),
        roundValue(rigidBodyRef.current.rotation().z, 2),
        roundValue(rigidBodyRef.current.rotation().w, 2)
      );

      // Comparar y actualizar solo si hay cambios significativos
      if (!currentPosition.equals(lastPositionRef.current)) {
        setPosition(currentPosition);
        lastPositionRef.current.copy(currentPosition);
      }

      if (!currentRotation.equals(lastRotationRef.current)) {
        setRotation(currentRotation);
        lastRotationRef.current.copy(currentRotation);
      }
    }
  });
};

export default usePlayerState;
