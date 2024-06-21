import { type FC, useEffect } from 'react';
import {
  useGLTF,
  useAnimations,
  /*Mask, useMask,*/
  Environment,
  MeshPortalMaterial,
} from '@react-three/drei';
import { ARView, ARAnchor } from './react-three-mind/AR';
// import { LoopOnce } from 'three';

const Model: FC = () => {
  const { scene, animations, nodes } = useGLTF('cube.gltf');
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

const App: FC = () => {
  return (
    <main>
      <header>Hello world</header>
      <ARView>
        <ARAnchor></ARAnchor>
        <Model />
      </ARView>
    </main>
  );
};

export default App;
