import React from "react";

const Character: React.FC = () => {
  console.log("repaint Character");

  return (
    <mesh castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="blue" />
      <mesh position={[0, 1.05, 0.45]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </mesh>
  );
};

export default Character;
