import React from "react";
import { atom, useAtom } from "jotai";
import { RigidBody } from "@react-three/rapier";

interface CubeProps {
  position: [number, number, number];
}

const cubesAtom = atom<CubeProps[]>(
  [...Array(10)].map(() => ({
    position: [
      Math.random() * 10 - 5,
      Math.random() * 5 + 1,
      Math.random() * 10 - 5,
    ] as [number, number, number],
  }))
);

const Cube: React.FC<CubeProps> = ({ position }) => {
  return (
    <RigidBody>
      <mesh position={position} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
};

const Cubes: React.FC = () => {
  const [cubes] = useAtom(cubesAtom);
  return (
    <>
      {cubes.map((cube, index) => (
        <Cube key={index} position={cube.position} />
      ))}
    </>
  );
};

export default Cubes;
