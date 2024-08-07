import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ecctrl, { EcctrlJoystick } from "ecctrl";
import Floor from "./components/Floor";
import Cubes from "./components/Cubes";
import Character from "./components/Character";
import { useAtom } from "jotai";
import { playerStateAtom } from "./playerStateStore";
import { isEqual } from "lodash";
import MovingCube from "./components/MovingCube";

// Memoizing the components to avoid unnecessary re-renders
const MemoizedFloor = React.memo(Floor);
const MemoizedCubes = React.memo(Cubes);
const MemoizedCharacter = React.memo(Character);

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

const App: React.FC = () => {
  const ref = useRef<any>(null);
  const [playerState] = useAtom(playerStateAtom);

  const previousRotation = useRef(playerState.rotation);
  // Memorizar el effect con callback
  const handlePlayerStateChange = useCallback(() => {
    if (!isEqual(playerState.rotation, previousRotation.current)) {
      previousRotation.current = playerState.rotation;
      console.log("rotacion", playerState.rotation);
    }
  }, [playerState]);

  useEffect(() => {
    handlePlayerStateChange();
  }, [handlePlayerStateChange]);

  return (
    <>
      <EcctrlJoystick>
        <ambientLight />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </EcctrlJoystick>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          <KeyboardControls map={keyboardMap}>
            <Ecctrl debug ref={ref}>
              <MemoizedHandleRotAndPos refE={ref} />
              <MemoizedCharacter />
            </Ecctrl>
          </KeyboardControls>
          <MemoizedFloor />
          <MemoizedCubes />
          <MovingCube />
        </Physics>
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default App;

const UPDATE_SOCKET_INTERVAL = 500; // ms

const HandleRotAndPos = ({ refE }: any) => {
  const [playerState, setPlayerState] = useAtom(playerStateAtom);
  const [previousPosition, setPreviousPosition] = useState(
    playerState.position
  );
  const [previousRotation, setPreviousRotation] = useState(
    playerState.rotation
  );
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const roundValue = useCallback((value: number, precision: number) => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }, []);

  const roundPosition = useCallback(
    (position: any, precision: number) => ({
      x: roundValue(position.x, precision),
      y: roundValue(position.y, precision),
      z: roundValue(position.z, precision),
    }),
    [roundValue]
  );

  const roundRotation = useCallback(
    (rotation: any, precision: number) => ({
      x: roundValue(rotation.x, precision),
      y: roundValue(rotation.y, precision),
      z: roundValue(rotation.z, precision),
    }),
    [roundValue]
  );

  useFrame(() => {
    const now = Date.now();
    if (now - lastUpdateTime >= UPDATE_SOCKET_INTERVAL && refE.current) {
      const currentPosition = roundPosition(
        {
          x: refE.current.translation().x,
          y: refE.current.translation().y,
          z: refE.current.translation().z,
        },
        10
      );

      const currentRotation = roundRotation(
        {
          x: refE.current.rotation().x,
          y: refE.current.rotation().y,
          z: refE.current.rotation().z,
        },
        10
      );

      if (
        !isEqual(currentPosition, previousPosition) ||
        !isEqual(currentRotation, previousRotation)
      ) {
        setPlayerState((prevState) => ({
          ...prevState,
          position: currentPosition,
          rotation: refE.current.rotation(),
        }));

        setPreviousPosition(currentPosition);
        setPreviousRotation(currentRotation);
      }

      setLastUpdateTime(now);
    }
  });

  return null;
};

// Memoize HandleRotAndPos component
const MemoizedHandleRotAndPos = React.memo(HandleRotAndPos);
