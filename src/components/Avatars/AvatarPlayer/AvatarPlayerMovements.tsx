import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { useAtom } from "jotai";
import { isEqual } from "lodash";
import { useState, useCallback } from "react";
import { playerStateAtom } from "../../../playerStateStore";

const UPDATE_SOCKET_INTERVAL = 750; // ms

interface AvatarPlayerMovementsProps {
  rigidBodyRef: React.RefObject<RapierRigidBody>;
}

const AvatarPlayerMovements: React.FC<AvatarPlayerMovementsProps> = ({
  rigidBodyRef: refE,
}) => {
  const [playerState, setPlayerState] = useAtom(playerStateAtom);
  const { position, rotation } = playerState;
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const roundValue = useCallback((value: number, precision: number): number => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }, []);

  const roundPosition = useCallback(
    (position: { x: number; y: number; z: number }, precision: number) => ({
      x: roundValue(position.x, precision),
      y: roundValue(position.y, precision),
      z: roundValue(position.z, precision),
    }),
    [roundValue]
  );

  const roundRotation = useCallback(
    (
      rotation: { x: number; y: number; z: number; w: number },
      precision: number
    ) => ({
      x: roundValue(rotation.x, precision),
      y: roundValue(rotation.y, precision),
      z: roundValue(rotation.z, precision),
      w: roundValue(rotation.w, precision),
    }),
    [roundValue]
  );

  useFrame(() => {
    const now = Date.now();
    if (now - lastUpdateTime >= UPDATE_SOCKET_INTERVAL && refE.current) {
      // Calcular la posición y rotación actuales (sin cambios)
      const currentPosition = roundPosition(
        {
          x: refE.current.translation().x,
          y: refE.current.translation().y,
          z: refE.current.translation().z,
        },
        3
      );

      const currentRotation = roundRotation(
        {
          x: refE.current.rotation().x,
          y: refE.current.rotation().y,
          z: refE.current.rotation().z,
          w: refE.current.rotation().w,
        },
        3
      );

      // Comparar directamente con los valores de playerState
      if (
        !isEqual(currentPosition, position) &&
        !isEqual(currentRotation, rotation)
      ) {
        setPlayerState((prevState) => ({
          ...prevState,
          position: currentPosition,
          rotation: currentRotation,
        }));
      }

      setLastUpdateTime(now);
    }
  });

  return null;
};

export default AvatarPlayerMovements;
