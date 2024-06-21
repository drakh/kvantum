/* eslint-disable */
import {
  type FC,
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';
import { type CanvasProps, Canvas, useThree } from '@react-three/fiber';
import {
  Matrix4,
  type Matrix4Tuple,
  Quaternion,
  Vector3,
  type PerspectiveCamera,
  type Group,
  type Object3DEventMap,
} from 'three';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { Html } from '@react-three/drei';
import type { IOnUpdate } from 'mind-ar-ts/src/image-target/utils/types/controller';
import Webcam from 'react-webcam';
import { useWindowSize } from './hooks';
import 'mind-ar-ts';

const modeAtom = atom(false);
const anchorsAtom = atom<{ [key: number]: Matrix4Tuple | null }>({});
const flipUserCameraAtom = atom(true);

type ARRef = {
  startTracking: () => void;
  stopTracking: () => void;
  switchCamera: () => void;
};

type ARProps = {
  autoplay?: boolean;
  imageTarget?: string;
  maxTrack?: number;
  filterMinCF?: number;
  filterBeta?: number;
  warmupTolerance?: number;
  missTolerance?: number;
  flipUserCamera?: boolean;
  onReady?: () => void;
  onError?: (e: string | DOMException) => void;
};

type ARProviderProps = ARProps & JSX.IntrinsicElements['group'];

const ARProvider = forwardRef<ARRef, ARProviderProps>(
  (
    {
      children,
      autoplay,
      imageTarget,
      maxTrack,
      filterMinCF = null,
      filterBeta = null,
      warmupTolerance = null,
      missTolerance = null,
      flipUserCamera = false,
      onReady = null,
      onError = null,
    },
    ref,
  ) => {
    const [isWebcamFacingUser, switchCamera] = useState(!imageTarget);
    const processingVideo = useRef(false);
    const webcamRef = useRef<Webcam>(null);
    const [ready, setReady] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controllerRef = useRef<any>();
    const { camera } = useThree();
    const setMode = useSetAtom(modeAtom);
    const setAnchors = useSetAtom(anchorsAtom);
    const setFlipUserCamera = useSetAtom(flipUserCameraAtom);

    const { width, height } = useWindowSize();

    useEffect(
      () => setFlipUserCamera(flipUserCamera),
      [flipUserCamera, setFlipUserCamera],
    );

    useEffect(() => {
      setMode(Boolean(imageTarget));
    }, [imageTarget, setMode]);

    const handleStream = useCallback(() => {
      if (webcamRef.current?.video) {
        webcamRef.current.video.addEventListener('loadedmetadata', () => setReady(true));
      }
    }, [webcamRef]);

    const startTracking = useCallback(async () => {
      if (ready) {
        if (imageTarget && webcamRef.current?.video) {
          processingVideo.current = true;
          const onUpdate = ({ type, targetIndex, worldMatrix }: IOnUpdate) => {
            if (type === 'updateMatrix' && targetIndex !== undefined && worldMatrix !== undefined) {
              setAnchors((anchors) => ({
                ...anchors,
                [targetIndex as number]:
                  worldMatrix !== null
                    ? new Matrix4()
                      .fromArray([...worldMatrix])
                      .multiply(postMatrices[targetIndex as number])
                      .toArray()
                    : null,
              }));
            }
          };

          const controller = new window.MINDAR.IMAGE.Controller({
            inputWidth: webcamRef.current?.video?.videoWidth,
            inputHeight: webcamRef.current?.video?.videoHeight,
            maxTrack,
            filterMinCF,
            filterBeta,
            missTolerance,
            warmupTolerance,
            onUpdate,
          });

          const { dimensions: imageTargetDimensions } = await controller.addImageTargets(
            imageTarget,
          );

          const postMatrices = imageTargetDimensions.map(([markerWidth, markerHeight]) =>
            new Matrix4().compose(
              new Vector3(
                markerWidth / 2,
                markerWidth / 2 + (markerHeight - markerWidth) / 2,
              ),
              new Quaternion(),
              new Vector3(markerWidth, markerWidth, markerWidth),
            ),
          );

          const ARprojectionMatrix = controller.getProjectionMatrix();

          (camera as PerspectiveCamera).fov =
            (2 * Math.atan(1 / ARprojectionMatrix[5]) * 180) / Math.PI;
          camera.near = ARprojectionMatrix[14] / (ARprojectionMatrix[10] - 1.0);
          camera.far = ARprojectionMatrix[14] / (ARprojectionMatrix[10] + 1.0);
          camera.updateProjectionMatrix();
          try {
            controller.dummyRun(webcamRef.current.video);
            controller.processVideo(webcamRef.current.video);
            controllerRef.current = controller;
          } catch (e) {
            console.info('err', e);
          }
        }

        onReady && onReady();
      }
    }, [
      ready,
      imageTarget,
      onReady,
      maxTrack,
      filterMinCF,
      filterBeta,
      missTolerance,
      warmupTolerance,
      camera,
      setAnchors,
    ]);

    const stopTracking = useCallback(() => {
      if (controllerRef.current) {
        processingVideo.current = false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        controllerRef.current.stopProcessVideo();
      }
    }, [controllerRef]);

    useImperativeHandle(
      ref,
      () => ({
        startTracking,
        stopTracking,
        switchCamera: async () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const wasTracking = controllerRef.current && processingVideo.current;
          wasTracking && stopTracking();
          setReady(false);
          switchCamera((isWebcamFacingUser) => !isWebcamFacingUser);
          wasTracking && (await startTracking());
        },
      }),
      [startTracking, stopTracking],
    );

    const startTrackingHandler = useCallback(async () => {
      if (ready && autoplay) {
        await startTracking();
      }
    }, [autoplay, ready, startTracking]);

    useEffect(() => {
      void startTrackingHandler();
    }, [startTrackingHandler]);

    return (
      <>
        <Html
          fullscreen
          zIndexRange={[-1, -1]}
          calculatePosition={() => [0, 0]}
          style={{
            top: 0,
            left: 0,
          }}
        >
          <Webcam
            ref={webcamRef}
            onUserMedia={handleStream}
            onUserMediaError={(e) => {
              onError && onError(e);
            }}
            height={height}
            width={width}
            videoConstraints={{
              facingMode: isWebcamFacingUser ? 'user' : 'environment',
            }}
            mirrored={isWebcamFacingUser && flipUserCamera}
          />
        </Html>
        {children}
      </>
    );
  },
);

type AnchorProps = {
  onAnchorFound?: () => void;
  onAnchorLost?: () => void;
  target?: number;
} & JSX.IntrinsicElements['group'];

const ARAnchor: FC<AnchorProps> = ({
                                     children,
                                     target = 0,
                                     onAnchorFound,
                                     onAnchorLost,
                                     ...rest
                                   }) => {
  const groupRef = useRef<Group<Object3DEventMap> | undefined>();
  const anchor = useAtomValue(anchorsAtom);
  const mode = useAtomValue(modeAtom);
  const flipUserCamera = useAtomValue(flipUserCameraAtom);

  useEffect(() => {
    if (groupRef.current) {
      if (mode) {
        if (anchor[target]) {
          if (groupRef.current?.visible !== true && onAnchorFound) onAnchorFound();
          groupRef.current.visible = true;

          const matrix = new Matrix4().fromArray(
            anchor[target] as Matrix4Tuple,
          );
          const position = new Vector3();
          const scale = new Vector3();
          const quaternion = new Quaternion();
          const updated=matrix.clone().decompose(position, quaternion, scale).clone().compose(new Vector3(-1 * position.x, position.y, position.z), new Quaternion(quaternion.x, -1 * quaternion.y, -1 * quaternion.z, quaternion.w), scale);
          console.info({ ...quaternion });

          groupRef.current.matrix = updated;
        } else {
          if (groupRef.current?.visible !== false && onAnchorLost) onAnchorLost();
          groupRef.current.visible = false;
        }
      } else {
        if (groupRef.current?.visible !== false && onAnchorLost) onAnchorLost();
        groupRef.current.visible = false;
      }
    }
  }, [anchor, target, onAnchorFound, onAnchorLost, mode]);

  return (
    <group scale={[flipUserCamera ? -1 : 1, 1, 1]}>
      <group
        ref={groupRef as Ref<Group<Object3DEventMap>>}
        visible={false}
        matrixAutoUpdate={false}
        {...rest}
      >
        {children}
      </group>
    </group>
  );
};

type ARViewProps = JSX.IntrinsicElements['canvas'] & CanvasProps & ARProps;

const ARView = forwardRef<ARRef, ARViewProps>(
  (
    {
      children,
      autoplay = true,
      imageTarget,
      maxTrack = 1,
      filterMinCF,
      filterBeta,
      warmupTolerance,
      missTolerance,
      flipUserCamera = true,
      onReady,
      onError,
      ...rest
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ARProviderRef = useRef<ARRef>(null);

    useImperativeHandle(ref, () => ({
      startTracking: () => ARProviderRef.current?.startTracking(),
      stopTracking: () => ARProviderRef.current?.stopTracking(),
      switchCamera: () => ARProviderRef.current?.switchCamera(),
      current: canvasRef.current,
    }));

    return (
      <Canvas
        style={{ position: 'absolute', minWidth: '100vw', minHeight: '100vh' }}
        {...rest}
        ref={canvasRef}
      >
        <Suspense fallback={null}>
          <ARProvider
            {...{
              autoplay,
              imageTarget,
              maxTrack,
              filterMinCF,
              filterBeta,
              warmupTolerance,
              missTolerance,
              flipUserCamera,
              onReady,
              onError,
            }}
            ref={ARProviderRef}
          >
            {children}
          </ARProvider>
        </Suspense>
      </Canvas>
    );
  },
);

export { ARView, ARAnchor };
