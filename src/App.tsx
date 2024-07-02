import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stats, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import Floor from "./components/Floor";
import Cubes from "./components/Cubes";
import AvatarPlayer from "./components/Avatars/AvatarPlayer/AvatarPlayer";
import Avatar from "./components/Avatars/Avatar";

// Memoizing the components to avoid unnecessary re-renders
const MemoizedFloor = React.memo(Floor);

const App: React.FC = () => {
  console.log("render App");

  return (
    <>
      <EcctrlJoystick />
      <Canvas shadows>
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          <MemoizedFloor />
          <Cubes />
          <AvatarPlayer />
        </Physics>
        <Avatar
          position={[0, 0, 0]}
          animationUrl="./assets/avatars/Animations.glb"
        />
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
};

useGLTF.preload("./assets/avatars/Animations.glb");
export default App;
