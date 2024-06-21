/* eslint-disable */
import { type FC, useEffect } from 'react';
import {
  useAnimations,
  useGLTF,
  /*Mask, useMask,*/
} from '@react-three/drei';
import { ZapparCamera, ImageTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber';
// import { LoopOnce } from 'three';
// import { TestScene } from './TestScene';
import { MathUtils } from 'three';
// @ts-ignore: no types
// import { ARAnchor, ARView } from "react-three-mind";

const targetFile = new URL('./assets/targets/example-tracking-image.zpt', import.meta.url).href;

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
      {/*<ARView*/}
      {/*  ref={ref}*/}
      {/*  autoplay // Automatically starts tracking once the camera stream is ready*/}
      {/*  flipUserCamera={false} // Prevents automatic flipping of the user camera*/}
      {/*  imageTarget={`assets/targets/kvantum-qr.mind`} // URL of the generated image targets features*/}
      {/*  maxTrack={1} // Maximum number of targets tracked simultaneously*/}
      {/*  filterMinCF={0.1} // Cutoff Frequency, decrease to reduce jittering*/}
      {/*  filterBeta={1000} // Speed Coefficient, increase to reduce delay*/}
      {/*  warmupTolerance={5} // Number of continuous frames required for a target being detected to be marked as found*/}
      {/*  missTolerance={5} // Number of continuous frames required for a target not being detected to be marked as lost*/}
      {/*>*/}
      {/*  <ambientLight intensity={1.5} />*/}
      {/*  <hemisphereLight intensity={1.5} groundColor="white" />*/}
      {/*  <ARAnchor></ARAnchor>*/}

      {/*</ARView>*/}
      <ZapparCanvas>
        <ZapparCamera />
        <ImageTracker
          onNotVisible={(anchor) => console.log(`Not visible ${anchor.id}`)}
          onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
          onVisible={(anchor) => console.log(`Visible ${anchor.id}`)}
          targetImage={targetFile}
        >
            <mesh
              position={[0, 0, 0]}
              rotation={[degToRad(20), degToRad(90), 0]}
              scale={[3, 3, 3]}
            >
              <Snowman />
              <Trees />
              <Hill />
            </mesh>
          <mesh position={[0, 0, -5]}>
            <sphereBufferGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </ImageTracker>
        <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      </ZapparCanvas>
    </main>
  );
};

export default App;
