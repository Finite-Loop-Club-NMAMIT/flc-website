
import { useMemo, useEffect, useLayoutEffect, Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three-stdlib";
import {
  Text3D,
  OrbitControls,
  Center,
  Sparkles,
} from "@react-three/drei";


function AsciiBG() {
  return (
    <div className="absolute w-full h-full">
      <Canvas camera={{ position: [0, 0, -10], fov: 75 }}>
        {/* <OrbitControls
          enableZoom={true}
          // autoRotate={true}
          autoRotateSpeed={-0.1}
          enablePan={true}
          // azimuth={[-Math.PI / 4, Math.PI / 4]}
          zoomSpeed={0.15}
          dampingFactor={0.05}
        /> */}

        <Suspense>
          <Sparkles
            count={300}
            size={5}
            speed={1}
            opacity={1}
            scale={25}
            color="#fff3b0"
          />
          <Wrapper />
        </Suspense>
        <AsciiRenderer />
      </Canvas>
    </div>
  );
}

function Wrapper() {
  const ref = useRef(null);
  const { width: w, height: h } = useThree((state) => state.viewport);

  return (
    <>
      <Center scale={[0.9, 1, 1]}>
        <Text3D
          position={[0, 0.2, 20]}
          scale={[-1, 1, 1]}
          ref={ref}
          size={w / 10}
          font={"/font/font.json"}
          curveSegments={6}
          bevelSegments={1}
          bevelEnabled
          bevelSize={0.08}
          bevelThickness={0.03}
          height={1}
          lineHeight={1}
          letterSpacing={0.3}
        >
          {`FINITEL00P`}
          <meshStandardMaterial color="yellow" />
        </Text3D>
      </Center>

      <ambientLight intensity={.8} />
      <directionalLight color="white" position={[0, 0, -5]} />
    </>
  )
}
export default AsciiBG;

const characters = " .:-+*=%@#";

function AsciiRenderer({
  renderIndex = 1,
  invert = false,
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, {
      invert: false,
      color: false,
      resolution: 0.175
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [invert]);

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.replaceWith(effect.domElement);
    return () => {
      gl.domElement.replaceWith(effect.domElement);
    };
  }, [effect]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component returns nothing, it is a purely logical
  return null;
}


