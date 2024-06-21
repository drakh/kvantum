import React, { Suspense } from 'react';
import {
  ZapparCamera,
  ImageTracker,
  ZapparCanvas,
  Loader,
  BrowserCompatibility,
} from '@zappar/zappar-react-three-fiber';

const targetFile = 'assets/targets/qr-code.png.zpt';

// console.info(targetFile);

const App: React.FC = () => {
  return (
    <>
      <BrowserCompatibility />
      <ZapparCanvas>
        <ZapparCamera />
        <Suspense fallback={null}>
          <ImageTracker
            onNotVisible={(anchor) => console.log(`Not visible ${anchor.id}`)}
            onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
            onVisible={(anchor) => console.log(`Visible ${anchor.id}`)}
            targetImage={targetFile}
          >
            <mesh position={[0, 0, -5]}>
              <sphereBufferGeometry />
              <meshStandardMaterial color="hotpink" />
            </mesh>
            <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
          </ImageTracker>
        </Suspense>
        <Loader />
      </ZapparCanvas>
    </>
  );
};

export default App;
