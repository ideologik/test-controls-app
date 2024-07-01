import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, OrbitControls, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl";
import Floor from "./components/Floor";
import { useAtom } from "jotai";
import { playerStateAtom } from "./playerStateStore";
import { isEqual } from "lodash";
import Avatar from "./components/Avatar";

// Memoizing the components to avoid unnecessary re-renders
const MemoizedFloor = React.memo(Floor);
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

const App: React.FC = () => {
  const ref = useRef(null);
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
    <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Physics>
        <KeyboardControls map={keyboardMap}>
          <Suspense fallback={<></>}>
            <Ecctrl animated ref={ref}>
              <EcctrlAnimation
                characterURL={"./assets/avatars/Animations.glb"}
                animationSet={animationSet}
              >
                <MemoizedHandleRotAndPos refE={ref} />
                <MemoizedCharacter />
              </EcctrlAnimation>
            </Ecctrl>
          </Suspense>
        </KeyboardControls>
        <MemoizedFloor />
        {/* <MemoizedCubes />
          <MovingCube /> */}
      </Physics>
      <OrbitControls />
      <Avatar />
    </Canvas>
  );
};

useGLTF.preload("./assets/avatars/Animations.glb");
export default App;

const UPDATE_SOCKET_INTERVAL = 1500; // ms


const HandleRotAndPos = ({ refE }) => {
  const [playerState, setPlayerState] = useAtom(playerStateAtom);
  const [previousPosition, setPreviousPosition] = useState(
    playerState.position
  );
  const [previousRotation, setPreviousRotation] = useState(
    playerState.rotation
  );
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const roundValue = useCallback((value, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }, []);

  const roundPosition = useCallback(
    (position, precision) => ({
      x: roundValue(position.x, precision),
      y: roundValue(position.y, precision),
      z: roundValue(position.z, precision),
    }),
    [roundValue]
  );

  const roundRotation = useCallback(
    (rotation, precision) => ({
      x: roundValue(rotation.x, precision),
      y: roundValue(rotation.y, precision),
      z: roundValue(rotation.z, precision),
      w: roundValue(rotation.w, precision),
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
        4
      );

      const currentRotation = roundRotation(
        {
          x: refE.current.rotation().x,
          y: refE.current.rotation().y,
          z: refE.current.rotation().z,
          w: refE.current.rotation().w,
        },
        4
      );

      if (
        !isEqual(currentPosition, previousPosition) ||
        !isEqual(currentRotation, previousRotation)
      ) {
        setPlayerState((prevState) => ({
          ...prevState,
          position: currentPosition,
          rotation: currentRotation,
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
