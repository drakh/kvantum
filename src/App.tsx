import { type FC, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { ARView, ARAnchor } from './react-three-mind/AR';
// import { LoopOnce } from 'three';

const Model: FC = () => {
  const { scene, animations } = useGLTF('cube.gltf');
  const { clips, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    const [clip] = clips;
    console.info({ clips });
    // mixer.clipAction(clip).loop = LoopOnce;
    mixer.clipAction(clip).play();
    clip.duration;
    mixer.clipAction(clip).halt(clip.duration / 1.2);
  }, [clips, mixer]);

  console.info({ scene, animations, clips, mixer });

  return <primitive object={scene} />;
};

const App: FC = () => {
  return (
    <main>
      <header>Hello world</header>
      <ARView>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <ARAnchor></ARAnchor>
        <Model />
      </ARView>
    </main>
  );
};

export default App;
