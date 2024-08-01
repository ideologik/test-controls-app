import React from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

type AvatarModelProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string;
};

const AvatarModel: React.FC<AvatarModelProps> = ({ modelUrl, ...props }) => {
  console.log("render AvatarModel");

  const { scene: avatarScene } = useGLTF(modelUrl);
  const avatarClone = SkeletonUtils.clone(avatarScene);

  return <primitive object={avatarClone} {...props} />;
};

export default AvatarModel;
