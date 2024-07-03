import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import React, { useCallback, useEffect, useRef } from "react";
import { RapierRigidBody } from "@react-three/rapier";
import { playerStateAtom } from "../../../playerStateStore";
import { useAtom } from "jotai";
import { isEqual } from "lodash";
import AvatarPlayerBase from "./AvatarPlayerBase";
//import AvatarPlayerMovements from "./AvatarPlayerMovements";

const MemoizedAvatarPlayerBase = React.memo(AvatarPlayerBase);

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];
const animationSet = {
  idle: "Idle",
  walk: "Walking",
  run: "Running",
  jump: "Jumping",
  jumpIdle: "Jumping",
  jumpLand: "Jumping",
  fall: "Jumping",
};
type AvatarPlayerProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarPlayer: React.FC<AvatarPlayerProps> = ({ modelUrl, ...props }) => {
  console.log("render AvatarPlayer");
  const rigidBodyRef = useRef<RapierRigidBody | null>(null);
  const [playerState] = useAtom(playerStateAtom);

  const previousRotation = useRef(playerState.rotation);

  // Memorizar el effect con callback
  const handlePlayerStateChange = useCallback(() => {
    if (!isEqual(playerState.rotation, previousRotation.current)) {
      previousRotation.current = playerState.rotation;
      console.log("posicion", playerState.position);
      console.log("rotacion", playerState.rotation);
    }
  }, [playerState]);

  useEffect(() => {
    //handlePlayerStateChange();
  }, [handlePlayerStateChange]);

  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl animated ref={rigidBodyRef}>
        <EcctrlAnimation
          characterURL={"./assets/avatars/Animations.glb"}
          animationSet={animationSet}
        >
          <MemoizedAvatarPlayerBase {...props} modelUrl={modelUrl} />
        </EcctrlAnimation>
      </Ecctrl>
      {/* <AvatarPlayerMovements rigidBodyRef={rigidBodyRef} /> */}
    </KeyboardControls>
  );
};

export default AvatarPlayer;
