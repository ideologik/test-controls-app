import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useTexture } from "@react-three/drei";

const floorTextureUrl = "./assets/textures/checkerboard.jpg"; // Ruta de tu textura descargada

const Floor: React.FC = () => {
  const texture = useTexture(floorTextureUrl);
  return (
    <RigidBody type="fixed">
      <mesh receiveShadow rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  );
};

export default Floor;
