import { Canvas, useLoader } from "@react-three/fiber";
import FixedSocialBar from "./FixedSocialBar";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import VaporWave from "./VaporWave";


function Footer() {
    return (
        <>
            <FixedSocialBar />



            

            <section className="w-full h-screen" >
                <Canvas camera={{ position: [0, 0.06, 1.1], fov: 75, near: 0.01, far: 100 }}>
                    <fog attach="fog" color="#121422" near={1} far={2.5} />

                    {/* <OrbitControls
                        enableZoom={true}
                        // autoRotate={true}
                        autoRotateSpeed={-0.1}
                        enablePan={true}
                        // azimuth={[-Math.PI / 4, Math.PI / 4]}
                        zoomSpeed={0.15}
                        dampingFactor={0.05}
                    /> */}
                    {/* <ScrollControls damping={6} pages={2}>
                        <Scroll html>

                        </Scroll>

                        
                    </ScrollControls> */}

                    <VaporWave />
                    <ambientLight intensity={30} color="#ffffff" />
                    {/* <spotLight args={['#d53c3d', 20, 25, Math.PI * 0.1, 0.25]} position={[-0.5, 0.75, 2.2]} /> */}
                    {/* <spotLight args={['#d53c3d', 20, 25, Math.PI * 0.1, 0.25]} position={[-0.5, 0.75, 2.2]} /> */}


                    
                    {/* <InfinteTube /> */}
                </Canvas>
            </section>

        </>
    )
}

export default Footer;

function InfinteTube() {
    const points = [
        new THREE.Vector3(0, 0.06, 1.5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -20),
    ];

    const curve = new THREE.CatmullRomCurve3(points)
    const texture = useLoader(THREE.TextureLoader, "/images/galaxyTexture.jpg");
    return (
        <mesh>
            <tubeGeometry args={[curve, 10, 2, 10, false]} />
            <meshBasicMaterial
                side={THREE.DoubleSide}
                map={texture}
            />
        </mesh>
    );
};