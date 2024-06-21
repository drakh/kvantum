import { type FC } from 'react';
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
        <mesh scale={1.5} position={[-1.2, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={'orange'} />
        </mesh>
      </ARView>
    </main>
  );
};

export default App;
