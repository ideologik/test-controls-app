import { useEffect } from "react";
import { useAnimations } from "@react-three/drei";
import * as THREE from "three";
import usePlayerStore, {
  selectAnimation,
} from "../../../../stores/usePlayerStore";

const useRemoteAnimations = (
  avatarRef: React.RefObject<any>,
  animations: THREE.AnimationClip[]
) => {
  console.log("avatarRef", avatarRef);
  const { actions, names } = useAnimations(animations, avatarRef);
  const animation = usePlayerStore(selectAnimation);

  useEffect(() => {
    if (avatarRef && animation && actions && actions["Jump"]) {
      console.log("entre al useEffect animation", animation);
      const action = actions["Jump"]?.reset().fadeIn(0.5).play();
      return () => {
        if (actions["Idle"]) {
          action?.fadeOut(0.5);
        }
      };
    }
  }, [animation, actions, names, avatarRef]);

  // useEffect(() => {
  //   console.log(animation);
  //   let anim = "";
  //   if (animation === "Walking") {
  //     anim = "Walk";
  //   } else if (animation === "Running") {
  //     anim = "Walk";
  //   } else if (animation === "Jumping") {
  //     anim = "Jump";
  //   } else {
  //     anim = "Idle";
  //   }
  //   console.log(actions[anim]);
  //   if (anim && actions && actions[anim]) {
  //     console.log("Playing anim:", anim);
  //     actions[1]?.play();
  //     // return () => {
  //     //   if (actions["Idle"]) {
  //     //     action?.fadeOut(0.5);
  //     //   }
  //     // };
  //   }
  // }, [animation, actions, names]);
};

export default useRemoteAnimations;
