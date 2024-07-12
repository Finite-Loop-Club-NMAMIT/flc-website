import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function VaporWave() {
    const displacementMap = useLoader(THREE.TextureLoader, '/images/displacement.png');
    const metalnessMap = useLoader(THREE.TextureLoader, '/images/metalness.png');
    const gridMap = useLoader(THREE.TextureLoader, '/images/grid.png')

    const plane1Ref = useRef<THREE.Mesh>(null);
    const plane2Ref = useRef<THREE.Mesh>(null);

    const clock = new THREE.Clock();

    useFrame(() => {
        const elapsedTime = clock.getElapsedTime();
        if (plane1Ref.current && plane2Ref.current) {
            plane1Ref.current!.position.z = (elapsedTime * 0.15) % 2;
            //When the first plane reaches a position of z = 0 it to -2, its initial position
            plane2Ref.current!.position.z = (elapsedTime * 0.15 % 2) - 2;
        }

    })

    return (
        <>
            <mesh rotation={[-Math.PI * 0.5, 0, 0]} scale={[1, 1, 1]} position={[0, 0, 0.15]} ref={plane1Ref}>
                <planeGeometry args={[1, 2, 24, 24]} />
                <meshStandardMaterial displacementScale={0.4} displacementMap={displacementMap} metalnessMap={metalnessMap} metalness={0.8} roughness={0.5} map={gridMap} />
                {/* <Edges linewidth={1} threshold={0} color="red" /> */}
            </mesh>

            <mesh rotation={[-Math.PI * 0.5, 0, 0]} scale={[1, 1, 1]} position={[0, 0, 0.15]} ref={plane2Ref}>
                <planeGeometry args={[1, 2, 24, 24]} />
                <meshStandardMaterial displacementScale={0.4} displacementMap={displacementMap} metalnessMap={metalnessMap} metalness={0.8} roughness={0.5} map={gridMap} />
                {/* <Edges linewidth={1} threshold={0.4} color="red" /> */}
            </mesh>
        </>
    )
}

export default VaporWave;