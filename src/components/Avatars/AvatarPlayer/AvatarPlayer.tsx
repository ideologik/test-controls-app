import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import React, { useCallback, useEffect, useRef } from "react";
import { Suspense } from "react";
import Avatar from "../Avatar";
import { RapierRigidBody } from "@react-three/rapier";
import { playerStateAtom } from "../../../playerStateStore";
import { useAtom } from "jotai";
import { isEqual } from "lodash";
import AvatarPlayerMovements from "./AvatarPlayerMovements";

const MemoizedCharacter = React.memo(Avatar);

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

const AvatarPlayer: React.FC<JSX.IntrinsicElements["group"]> = ({
  ...props
}) => {
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
    handlePlayerStateChange();
  }, [handlePlayerStateChange]);

  return (
    <KeyboardControls map={keyboardMap}>
      <Suspense fallback={null}>
        <Ecctrl animated ref={rigidBodyRef}>
          <EcctrlAnimation
            characterURL={"./assets/avatars/Animations.glb"}
            animationSet={animationSet}
          >
            <AvatarPlayerMovements rigidBodyRef={rigidBodyRef} />
            <MemoizedCharacter {...props} />
          </EcctrlAnimation>
        </Ecctrl>
      </Suspense>
    </KeyboardControls>
  );
};

export default AvatarPlayer;
