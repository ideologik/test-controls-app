import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import AvatarModel from "./AvatarModel";

// Definición de tipos para las propiedades del componente AvatarAnimated
type AvatarAnimatedProps = JSX.IntrinsicElements["group"] & {
  modelUrl: string; // URL del modelo GLTF
  animationsUrl?: string | null; // URL opcional para las animaciones GLTF
  animation?: string | null; // Nombre de la animación inicial
};

// Interfaz que define el método setAnimation para el componente AvatarAnimated
export interface AvatarAnimatedHandle {
  setAnimation: (animationName: string) => void; // Método para cambiar la animación
}

// Constante para la animación por defecto
const DEFAULT_ANIMATION = "Idle";

// Definición del componente AvatarAnimated usando forwardRef para manejar referencias
const AvatarAnimated = forwardRef<AvatarAnimatedHandle, AvatarAnimatedProps>(
  (
    { modelUrl, animationsUrl = null, animation = DEFAULT_ANIMATION, ...props },
    ref
  ) => {
    console.log("render AvatarAnimated"); // Log para ver cuando se renderiza el componente

    // Referencia para el grupo del avatar
    const avatarRef = useRef<THREE.Group>(null);
    // Referencia para la animación actual
    const currentAnimation = useRef(animation);
    // Referencia para la acción de animación actual
    const action = useRef<THREE.AnimationAction | undefined>(undefined);

    // Carga el modelo GLTF desde la URL proporcionada
    const modelGLTF = useGLTF(modelUrl);

    // Carga las animaciones GLTF desde la URL proporcionada o desde el modelo si no se proporciona una URL específica
    const animationsGLTF = useGLTF(animationsUrl || modelUrl);
    const animations = animationsUrl
      ? animationsGLTF.animations
      : modelGLTF.animations;

    // Inicializa las animaciones y las asocia con avatarRef
    const { actions } = useAnimations(animations, avatarRef);

    // Define un método imperativo para cambiar la animación desde fuera del componente
    useImperativeHandle(ref, () => ({
      setAnimation: (animationName: string) => {
        if (actions && actions[animationName]) {
          console.log("cambiar a animación", animationName); // Log para ver cuando se cambia la animación
          currentAnimation.current = animationName; // Actualiza la animación actual
          // Detiene la animación actual con un desvanecimiento
          action.current?.fadeOut(0.5);
          // Inicia la nueva animación con un desvanecimiento
          action.current = actions[animationName]?.reset().fadeIn(0.5).play();
        }
      },
    }));

    // Efecto que se ejecuta cuando las acciones o la animación actual cambian
    useEffect(() => {
      if (actions && currentAnimation.current) {
        console.log("entre al useEffect", currentAnimation.current); // Log para ver cuando se ejecuta el useEffect
        // Inicia la animación actual
        action.current = actions[currentAnimation.current]?.reset().play();
        // Limpieza: detiene la animación actual cuando el componente se desmonta
        return () => {
          action.current?.fadeOut(0.5);
        };
      }
    }, [actions]); // Dependencias del efecto

    // Renderiza el componente AvatarModel con la referencia avatarRef asociada
    return <AvatarModel {...props} modelUrl={modelUrl} ref={avatarRef} />;
  }
);

// Exporta el componente AvatarAnimated para su uso en otros lugares
export default AvatarAnimated;
