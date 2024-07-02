import { FC, memo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { playerStateAtom } from "../playerStateStore";
import * as THREE from "three";
import Avatar from "./Avatar";

const MovingCube: FC = () => {
  const [playerState] = useAtom(playerStateAtom);

  const [currentPos, setCurrentPos] = useState(new THREE.Vector3());
  const [currentQuat, setCurrentQuat] = useState(new THREE.Quaternion());

  const [targetPos, setTargetPos] = useState(new THREE.Vector3());
  const [targetQuat, setTargetQuat] = useState(new THREE.Quaternion());

  useEffect(() => {
    const newPos = new THREE.Vector3(
      playerState.position.x,
      playerState.position.y,
      playerState.position.z
    );

    const newQuat = new THREE.Quaternion(
      playerState.rotation.x,
      playerState.rotation.y,
      playerState.rotation.z,
      playerState.rotation.w
    );

    // Verificar si la posición o la rotación han cambiado
    if (!newPos.equals(targetPos) || !newQuat.equals(targetQuat)) {
      setTargetPos(newPos);
      setTargetQuat(newQuat);
    }
  }, [playerState.position, playerState.rotation]);

  useFrame((state, delta) => {
    // Interpolar la posición
    const newPos = currentPos.clone().lerp(targetPos, delta * 1); // Ajuste del factor para suavizar el movimiento
    setCurrentPos(newPos);

    // Interpolar la rotación
    const newQuat = new THREE.Quaternion().slerpQuaternions(
      currentQuat,
      targetQuat,
      delta * 1
    ); // Ajuste del factor para suavizar el movimiento
    setCurrentQuat(newQuat);
  });

  // Convertir el cuaternión actual a ángulos de Euler para pasarlo al Avatar
  const currentEuler = new THREE.Euler().setFromQuaternion(currentQuat);
  return (
    <Avatar
      position={[currentPos.x + 1.5, currentPos.y - 0.9, currentPos.z]}
      rotation={[currentEuler.x, currentEuler.y, currentEuler.z]} // Pasar la rotación como ángulos de Euler
    />
  );
};

export default memo(MovingCube);
