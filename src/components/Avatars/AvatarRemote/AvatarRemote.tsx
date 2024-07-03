import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";

import Avatar from "./AvatarRemoteBase";
import usePlayerStore from "../../../stores/usePlayerStore";

const AvatarRemote: React.FC<JSX.IntrinsicElements["group"]> = ({
  ...props
}) => {
  const position = usePlayerStore((state) => state.position);
  const rotation = usePlayerStore((state) => state.rotation);

  const [currentPos, setCurrentPos] = useState(new THREE.Vector3());
  const [currentQuat, setCurrentQuat] = useState(new THREE.Quaternion());

  const [targetPos, setTargetPos] = useState(new THREE.Vector3());
  const [targetQuat, setTargetQuat] = useState(new THREE.Quaternion());

  useEffect(() => {
    const newPos = new THREE.Vector3(position.x, position.y, position.z);
    const newQuat = new THREE.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );

    // Verificar si la posición o la rotación han cambiado
    if (!newPos.equals(targetPos) || !newQuat.equals(targetQuat)) {
      setTargetPos(newPos);
      setTargetQuat(newQuat);
    }
  }, [position, rotation, targetPos, targetQuat]);

  useFrame((_, delta) => {
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
      {...props}
      position={[currentPos.x + 1.5, currentPos.y - 0.9, currentPos.z]}
      rotation={[currentEuler.x, currentEuler.y, currentEuler.z]} // Pasar la rotación como ángulos de Euler
    />
  );
};

export default AvatarRemote;
