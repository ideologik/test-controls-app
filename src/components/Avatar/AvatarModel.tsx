import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Group } from "three";

type AvatarModelProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarModel = forwardRef<Group, AvatarModelProps>(
  ({ modelUrl, ...props }, ref) => {
    console.log("render AvatarModel");

    const { scene: avatarScene } = useGLTF(modelUrl);
    const avatarClone = SkeletonUtils.clone(avatarScene);

    return <primitive object={avatarClone} ref={ref} {...props} />;
  }
);

export default AvatarModel;
