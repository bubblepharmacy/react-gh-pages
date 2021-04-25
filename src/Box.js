import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Button from 'react-bootstrap/Button';


function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.y += 0.005;
  })
  return (
    <>
    <mesh
      {...props}
      ref={mesh}
      scale={hovered ? [3, 3, 3] : [2, 2, 2]}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <octahedronGeometry radius = {5} />
      <meshStandardMaterial color={hovered ? 'gray' : 'black'} opacity={hovered ? 0.5 : 0.9} />
    </mesh>
    </>
  )
}

export default Box;
