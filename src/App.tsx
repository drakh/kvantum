import { type FC, useEffect } from 'react';
import {
  useAnimations,
  useGLTF,
  /*Mask, useMask,*/
} from '@react-three/drei';
import { ARView, ARAnchor } from './react-three-mind/AR';
// import { LoopOnce } from 'three';
// import { TestScene } from './TestScene';
import { MathUtils } from 'three';

const { degToRad } = MathUtils;

const Hill: FC = () => {
  const { scene, nodes } = useGLTF('assets/models/hill.gltf');
  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }
  return <primitive object={scene} />;
};
const Trees: FC = () => {
  const { scene, nodes } = useGLTF('assets/models/trees.gltf');
  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }
  return <primitive object={scene} />;
};

const Snowman: FC = () => {
  const { scene, animations, nodes } = useGLTF('assets/models/snehuliak.gltf');
  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }
  const { clips, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    clips.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    // mixer.clipAction(clip).loop = LoopOnce;
    // clip.duration;
    // mixer.clipAction(clip).halt(clip.duration / 1.2);
  }, [clips, mixer, nodes]);

  return <primitive object={scene} />;
};

const App: FC = () => {
  return (
    <main>
      <header>Hello world</header>
      <ARView>
        <ambientLight intensity={1.5} />
        <hemisphereLight intensity={1.5} groundColor="white" />
        <ARAnchor></ARAnchor>
        <mesh
          position={[0, 0, 0]}
          rotation={[degToRad(20), degToRad(90), 0]}
          scale={[3, 3, 3]}
        >
          <Snowman />
          <Trees />
          <Hill />
        </mesh>
      </ARView>
    </main>
  );
};

export default App;
