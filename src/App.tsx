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
        <a href="https://www.minzp.sk/iep/publikacie/komentare/lyzovacka-na-blate.html">
          <strong>{YEARS[currentIndex]}</strong>: počet dní{' '}
          <strong>{DAYS[currentIndex]}</strong> (možné maximum {MAX_DAYS})
        </a>
      </header>
      <section>
        <ARView
          imageTarget={`assets/kvantum-qr.mind`}
          maxTrack={1} // Maximum number of targets tracked simultaneously
          filterMinCF={0.01} // Cutoff Frequency, decrease to reduce jittering
          filterBeta={1000} // Speed Coefficient, increase to reduce delay
          warmupTolerance={10} // Number of continuous frames required for a target being detected to be marked as found
          missTolerance={10}
        >
          <ARAnchor target={0} onAnchorFound={onAnchorFound} onAnchorLost={onAnchorLost}>
            {shouldCount ? (
              <mesh>
                <mesh position={[0, 0, -2]}>
                  <planeGeometry args={[2.1, 2.97]} />
                  <MeshPortalMaterial>
                    <ambientLight intensity={0.5} />
                    <hemisphereLight intensity={0.5} groundColor="white" />
                    <mesh
                      position={[0, 0, 0]}
                      rotation={[degToRad(5), degToRad(90), 0]}
                      scale={[1, 1, 1]}
                    >
                      <Snowman currentDay={currentIndex} />
                      <Trees />
                      <Hill />
                    </mesh>
                  </MeshPortalMaterial>
                </mesh>
              </mesh>
            ) : null}
          </ARAnchor>
        </ARView>
      </section>
    </main>
  );
};

export default App;
