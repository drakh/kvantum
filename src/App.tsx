import { type FC } from 'react';

// @ts-ignore: no typings
import { ARView, ARAnchor } from './react-three-mind/AR';

const App: FC = () => {
  return (
    <main>
      <header>Hello world</header>
      <ARView>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <ARAnchor></ARAnchor>
      </ARView>
    </main>
  );
};

export default App;
