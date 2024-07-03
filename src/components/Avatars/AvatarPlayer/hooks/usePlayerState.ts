import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { useState, useCallback } from "react";
import * as THREE from "three";
import usePlayerStore from "../../../../stores/usePlayerStore";

const UPDATE_SOCKET_INTERVAL = 750; // ms

const usePlayerState = (rigidBodyRef: React.RefObject<RapierRigidBody>) => {
  const position = usePlayerStore((state) => state.position);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const rotation = usePlayerStore((state) => state.rotation);
  const setRotation = usePlayerStore((state) => state.setRotation);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const roundValue = useCallback((value: number, precision: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }, []);

  useFrame(() => {
    const now = Date.now();
    if (
      now - lastUpdateTime >= UPDATE_SOCKET_INTERVAL &&
      rigidBodyRef.current
    ) {
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

      // Comparar y actualizar solo si hay cambios
      if (!currentPosition.equals(position)) {
        console.log("entro a cambiar posicion");
        setPosition(currentPosition);
      }

      if (!currentRotation.equals(rotation)) {
        console.log("entro a cambiar rotacion");
        setRotation(currentRotation);
      }

      setLastUpdateTime(now);
    }
  });
};

export default usePlayerState;
