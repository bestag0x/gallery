import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment, useTexture, Html, Preload, Scroll, ScrollControls } from '@react-three/drei'
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'


const GOLDENRATIO = 1.61803398875
export const App = ({ images }) => {

  return(
  <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
    <color attach="background" args={['#191920']} />
    <fog attach="fog" args={['#191920', 0, 15]} />
    <group position={[0, -0.5, 0]}>
      <Frames images={images} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
          />
      </mesh>
    </group>
    <Environment path="/" files="potsdamer_platz_1k.hdr" />
  </Canvas>

)}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)

    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={ref}
      //      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
      onClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))}

      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, text, desc, link, buyImage, c = new THREE.Color(), ...props }) {
  const image = useRef()
  const image22 = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = params?.id === name
  const [isVisible, setIsVisible] = useState(false);

  const buyImgUrl = '/15_normal.png'
  useCursor(hovered)
  useFrame((state, dt) => {
    //image22.current.material.zoom = 1 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1.1), 0.9 * (!isActive && hovered ? 0.905 : 1.1), 1], 0.1, dt)
    
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
    easing.damp3(image22.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
    image.current.material.opacity = (isActive && hovered ? 0.3 : 0)
    image.current.material.colorWrite = (isActive && hovered ? 1 : 0)
    isActive ? setIsVisible(true) : setIsVisible(false)

  })
  const imageMapName = (type) => `/15_${type}.jpg`;
  const colorMap = useLoader(TextureLoader, imageMapName('normal'))

  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        onClick={(e) => (console.log(e))}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial map={colorMap} metalness={0.5}  
          roughness={0.5}
          envMapIntensity={1}
          map-offset-x={0.52}
          map-offset-y={0.3}
          map-repeat-x={0.1}
          map-repeat-y={0.5} />
        <mesh  ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image  raycast={() => null} ref={image} position={[0, 0, 0.71]} transparent url={buyImgUrl} />
        <Image raycast={() => null} ref={image22} position={[0, 0, 0.7]} url={url} />

      </mesh>
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {text}
      </Text>
      <Text visible={isVisible} onClick={(e) => (e.stopPropagation(),window.open(
            `${link}`, "_blank"))} maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO-0.1, 0]} fontSize={0.035}>
        Buy it on amazon
      </Text>
    </group>
  )

  //      under box geometry
  //      <meshStandardMaterial color="#155515" metalness={0.5} roughness={0.5} envMapIntensity={2} />

  //      inside <Text/>
  //      {name.split('-').join(' ')}
}
