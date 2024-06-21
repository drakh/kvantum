import { type FC, useEffect, useCallback } from 'react';
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

export const Hill: FC = () => {
  const { scene, nodes } = useGLTF('assets/models/hill.gltf');
  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }
  return <primitive object={scene} />;
};
export const Trees: FC = () => {
  const { scene, nodes } = useGLTF('assets/models/trees.gltf');
  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }
  return <primitive object={scene} />;
};

export const Snowman: FC = () => {
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
  const onAnchorFound = useCallback(() => {
    console.info('have anchor');
  }, []);

  return (
    <main>
      <ARView
        imageTarget={`assets/kvantum-qr.mind`}
        onReady={() => {
          console.info('ready');
        }}
      >
        <ambientLight intensity={1.5} />
        <hemisphereLight intensity={1.5} groundColor="white" />
        <ARAnchor target={0} onAnchorFound={onAnchorFound}>
          <mesh>
            <planeGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </ARAnchor>
        <mesh
          position={[0, 0, 0]}
          rotation={[degToRad(20), degToRad(90), 0]}
          scale={[3, 3, 3]}
        >
          {/*<Snowman />*/}
          {/*<Trees />*/}
          {/*<Hill />*/}
        </mesh>
      </ARView>
    </main>
  );
};

export default App;
