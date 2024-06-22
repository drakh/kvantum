import { type FC, useEffect, useCallback, useState } from 'react';
import { useAnimations, useGLTF, MeshPortalMaterial } from '@react-three/drei';
import { ARView, ARAnchor } from './react-three-mind/AR';
import { MathUtils } from 'three';
import { YEARS, DAYS, MAX_DAYS } from './data.ts';

const { degToRad } = MathUtils;

const DURATION = 4.58;

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

export const Snowman: FC<{ currentDay: number }> = ({ currentDay }) => {
  const { scene, animations, nodes } = useGLTF('assets/models/snehuliak.gltf');
  for (const node in nodes) {
    nodes[node].receiveShadow = true;
    nodes[node].castShadow = true;
  }
  const { clips, mixer } = useAnimations(animations, scene);
  const [clip] = clips;

  useEffect(() => {
    mixer.clipAction(clip).paused = false;
    mixer.clipAction(clip).reset().setDuration(DURATION).startAt(0).play();
    const stopAfter = ((DAYS[currentDay] * (MAX_DAYS / 100)) / 100) * DURATION;
    // console.info(stopAfter);
    setTimeout(() => {
      mixer.clipAction(clip).paused = true;
    }, stopAfter * 1000);
  }, [clip, mixer, currentDay]);

  return <primitive object={scene} />;
};

const App: FC = () => {
  const [currentIndex, setIndex] = useState(0);
  const [shouldCount, setShouldCount] = useState(false);

  const onAnchorFound = useCallback(() => {
    setShouldCount(true);
  }, []);

  const onAnchorLost = useCallback(() => {
    setShouldCount(false);
  }, []);

  useEffect(() => {
    if (shouldCount) {
      setTimeout(() => {
        if (currentIndex < DAYS.length - 1) {
          setIndex(currentIndex + 1);
        }
      }, DURATION * 1000);
    }
  }, [currentIndex, shouldCount]);

  return (
    <main>
      <header>
        <strong>{YEARS[currentIndex]}</strong>: počet dní{' '}
        <strong>{DAYS[currentIndex]}</strong> (možné maximum {MAX_DAYS})
      </header>
      <section>
        <ARView imageTarget={`assets/kvantum-qr.mind`}>
          <ARAnchor target={0} onAnchorFound={onAnchorFound} onAnchorLost={onAnchorLost}>
            {shouldCount ? (
              <>
                <ambientLight intensity={0.5} />
                <hemisphereLight intensity={0.5} groundColor="white" />
                <mesh>
                  <planeGeometry args={[2.1, 2.97]} />
                  <MeshPortalMaterial>
                    <ambientLight intensity={0.5} />
                    <hemisphereLight intensity={0.5} groundColor="white" />
                    <mesh
                      position={[0, 0, 0]}
                      rotation={[degToRad(10), degToRad(90), 0]}
                      scale={[3, 3, 3]}
                    >
                      <Snowman currentDay={currentIndex} />
                      <Trees />
                      <Hill />
                    </mesh>
                  </MeshPortalMaterial>
                </mesh>
              </>
            ) : null}
          </ARAnchor>
        </ARView>
      </section>
    </main>
  );
};

export default App;
