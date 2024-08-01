import React, { useRef, useMemo } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";

import AvatarModel from "./AvatarModel";
import usePlayerState from "./hooks/usePlayerState";

const MemoizedAvatarModel = React.memo(AvatarModel);

type AvatarControllerProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarController: React.FC<AvatarControllerProps> = ({
  modelUrl,
  ...props
}) => {
  console.log("render AvatarController");
  const keyboardMap = useMemo(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
      { name: "rightward", keys: ["ArrowRight", "KeyD"] },
      { name: "jump", keys: ["Space"] },
      { name: "run", keys: ["Shift"] },
      { name: "action1", keys: ["KeyF"] },
    ],
    []
  );

  const animationSet = useMemo(
    () => ({
      idle: "Idle",
      walk: "Walk",
      run: "Run",
      jump: "Jump_Start",
      jumpIdle: "Jump_Idle",
      jumpLand: "Jump_Land",
      fall: "Jump_Start",
      action1: "Throw_Object",
    }),
    []
  );
  const rigidBodyRef = useRef<RapierRigidBody | null>(null);
  usePlayerState(rigidBodyRef);

  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl animated ref={rigidBodyRef}>
        <EcctrlAnimation characterURL={modelUrl} animationSet={animationSet}>
          <MemoizedAvatarModel {...props} modelUrl={modelUrl} />
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
};

export default AvatarController;
