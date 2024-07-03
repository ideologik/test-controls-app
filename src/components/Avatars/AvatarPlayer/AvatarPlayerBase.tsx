import React from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

type AvatarProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarPlayerBase: React.FC<AvatarProps> = ({ modelUrl, ...props }) => {
  console.log("render AvatarPlayerBase");

  const { scene: avatarScene } = useGLTF(modelUrl);
  const avatarClone = SkeletonUtils.clone(avatarScene);

  return <primitive object={avatarClone} {...props} position={[0, -0.96, 0]} />;
};

export default AvatarPlayerBase;
