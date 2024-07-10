import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stats, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import Floor from "./components/Floor";
import Cubes from "./components/Cubes";
import Avatar from "./components/Avatars/Avatar";
import AvatarPlayer from "./components/Avatars/AvatarPlayer/AvatarPlayer";
import AvatarRemote from "./components/Avatars/AvatarRemote/AvatarRemote";

// Memoizing the components to avoid unnecessary re-renders
const MemoizedFloor = React.memo(Floor);
const MemoizedAvatarPlayer = React.memo(AvatarPlayer);
const MemoizedAvatar = React.memo(Avatar);
const MemoizedAvatarRemote = React.memo(AvatarRemote);

const models = {
  animations: "./assets/avatars/Animations.glb",
  male_04: "./assets/avatars/SK_Custom_male_04_anim.glb",
  male_13: "./assets/avatars/SK_Custom_male_13_anim.glb",
  female_07: "./assets/avatars/SK_Custom_female_07_anim.glb",
  female_09: "./assets/avatars/SK_Custom_female_09_anim.glb",
  robot: "./assets/avatars/jaxa_iss_int-ball.glb",
  demon: "./assets/avatars/demon.glb",
  abel: "./assets/avatars/abel__lowpoly_character.glb",
};

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
          <MemoizedAvatarPlayer modelUrl={models.male_04} />
        </Physics>
        <MemoizedAvatarRemote modelUrl={models.female_07} />
        <MemoizedAvatar
          position={[1.5, 1.65, 0]}
          scale={[0.15, 0.15, 0.15]}
          modelUrl={models.abel}
          animation="Walk"
        />
        <MemoizedAvatar
          position={[3, 0, 0]}
          modelUrl={models.female_07}
          animation="Run"
        />
        <MemoizedAvatar
          position={[4.5, 0, 0]}
          modelUrl={models.female_09}
          animation="Jump_Start"
        />
        <MemoizedAvatar
          position={[6, 0, 0]}
          modelUrl={models.male_04}
          animation="Jump_Idle"
        />
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
};

useGLTF.preload("./assets/avatars/Animations.glb");
export default App;
