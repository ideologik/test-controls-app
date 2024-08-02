import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stats, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { EcctrlJoystick } from "ecctrl";
import Floor from "./components/Floor";
import { Avatar, AvatarController } from "./components/Avatar";
import { AvatarHandle } from "./components/Avatar/Avatar";

// Memoizing the components to avoid unnecessary re-renders
const MemoizedFloor = React.memo(Floor);
const MemoizedAvatarPlayer = React.memo(AvatarController);
const MemoizedAvatar = React.memo(Avatar);
//const MemoizedAvatarRemote = React.memo(AvatarRemote);

const models = {
  animations: "./assets/avatars/Animations.glb",
  male_04: "./assets/avatars/SK_Custom_male_04.glb",
  male_13: "./assets/avatars/SK_Custom_male_13.glb",
  female_07: "./assets/avatars/SK_Custom_female_07.glb",
  female_09: "./assets/avatars/SK_Custom_female_09.glb",
  robot: "./assets/avatars/jaxa_iss_int-ball.glb",
  demon: "./assets/avatars/demon.glb",
};

const App: React.FC = () => {
  console.log("render App");
  const avatarRef = useRef<AvatarHandle>(null);
  const changeAnimation = () => {
    console.log("entro al changeAnimation");
    if (avatarRef.current) {
      avatarRef.current.setAnimation("Jumping");
    }
  };

  return (
    <>
      <EcctrlJoystick />
      <button onClick={changeAnimation}>Change to Jump</button>
      <Canvas shadows>
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          <MemoizedFloor />
          {/* <Cubes /> */}
          <MemoizedAvatarPlayer modelUrl={models.male_04} />
        </Physics>
        {/* <MemoizedAvatarRemote modelUrl={models.female_07} /> */}
        <MemoizedAvatar
          ref={avatarRef}
          position={[1.5, 0, 0]}
          modelUrl={models.male_13}
          animationsUrl={models.animations}
          animation="Walking"
        />
        <MemoizedAvatar
          position={[3, 0, 0]}
          modelUrl={models.female_07}
          animationsUrl={models.animations}
          animation="Running"
        />
        <MemoizedAvatar
          position={[4.5, 0, 0]}
          modelUrl={models.female_09}
          animationsUrl={models.animations}
          animation="Jumping"
        />
        <MemoizedAvatar
          position={[6, 0, 0]}
          modelUrl={models.male_04}
          animationsUrl={models.animations}
          animation="Idle"
        />
        <OrbitControls />
        <Stats />
      </Canvas>
    </>
  );
};

useGLTF.preload("./assets/avatars/Animations.glb");
export default App;
