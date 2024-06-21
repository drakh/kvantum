import { type FC, useEffect } from 'react';
import {
  Environment,
  MeshPortalMaterial,
  useAnimations,
  useGLTF,
} from '@react-three/drei';

export const TestScene: FC = () => {
  const { scene, animations, nodes } = useGLTF('assets/models/cube.gltf');
  const { clips, mixer } = useAnimations(animations, scene);

  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }

  console.info({ scene, nodes });

  useEffect(() => {
    clips.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    // mixer.clipAction(clip).loop = LoopOnce;
    // clip.duration;
    // mixer.clipAction(clip).halt(clip.duration / 1.2);
  }, [clips, mixer, nodes]);

  scene.castShadow = true;
  scene.receiveShadow = true;

  // const stencil = useMask(1);
  //
  // console.info({ stencil });

  return (
    <>
      <mesh>
        <primitive object={scene} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <MeshPortalMaterial>
          <ambientLight intensity={0.5} />
          <hemisphereLight intensity={0.5} groundColor="white" />
          <Environment preset="city" />
          <mesh castShadow receiveShadow>
            <primitive object={scene} />
          </mesh>
        </MeshPortalMaterial>
      </mesh>
      {/*<Mask id={1} position={[0, 0, 0.95]}>*/}
      {/*  <planeGeometry />*/}
      {/*</Mask>*/}
      {/*  <mesh>*/}
      {/*    <planeGeometry />*/}
      {/*  </mesh>*/}

      {/*<Mask id={1}>*/}
      {/*  <planeGeometry />*/}
      {/*  <meshBasicMaterial />*/}
      {/*</Mask>*/}
      {/*<mesh>*/}
      {/*  <torusKnotGeometry />*/}
      {/*  <meshStandardMaterial {...stencil} />*/}
      {/*  <primitive object={scene} />*/}
      {/*</mesh>*/}
    </>
  );
};
