import { type FC } from 'react';
// @ts-ignore
import { ARView, ARAnchor } from "react-three-mind";

const App: FC = () => {
  return (
    <main>
      <header>Hello world</header>
        <ARView>
            <ARAnchor>

            </ARAnchor>
        </ARView>
    </main>
  );
};

export default App;
