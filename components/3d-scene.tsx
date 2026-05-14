'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, PointLight, AmbientLight } from '@react-three/drei'
import * as THREE from 'three'

interface CardData {
  id: number
  title: string
  description: string
  icon: string
}

const Card3D = ({
  position,
  rotation,
  scale,
  data,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  data: CardData
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Create a subtle floating animation
  const startY = position[1]
  let time = 0

  useFrame(() => {
    if (meshRef.current) {
      time += 0.002
      meshRef.current.position.y = startY + Math.sin(time) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Card mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 3, 0.2]} />
        <meshStandardMaterial
          color="#0a2e4a"
          metalness={0.3}
          roughness={0.4}
          emissive="#00d2ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Glowing border */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[2.4, 3, 0.02]} />
        <meshStandardMaterial
          color="#00d2ff"
          emissive="#A4F4FD"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Icon placeholder sphere */}
      <mesh position={[0, 0.8, 0.12]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#A4F4FD"
          emissive="#00d2ff"
          emissiveIntensity={0.8}
          metalness={0.6}
        />
      </mesh>

      {/* Title text indicator */}
      <mesh position={[0, 0.1, 0.12]}>
        <planeGeometry args={[1.8, 0.4]} />
        <meshStandardMaterial
          color="#A4F4FD"
          emissive="#A4F4FD"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Description indicator */}
      <mesh position={[0, -0.6, 0.12]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

interface Scene3DProps {
  scrollProgress: number
  cards: CardData[]
}

const Scene3DContent = ({ scrollProgress, cards }: Scene3DProps) => {
  const { camera } = useThree()

  // Calculate card positions and rotations based on scroll
  const cardConfigs = useMemo(() => {
    return cards.map((card, index) => {
      const angle = (index / cards.length) * Math.PI * 2
      const baseRadius = 3.5

      // Position cards in a circle
      const x = Math.cos(angle) * baseRadius
      const z = Math.sin(angle) * baseRadius
      const y = index % 2 === 0 ? 0.5 : -0.5

      // Rotation based on scroll and card position
      const scrollRotation = scrollProgress * Math.PI * 2
      const cardRotation = angle + scrollRotation

      return {
        position: [x, y, z] as [number, number, number],
        rotation: [cardRotation * 0.5, cardRotation, cardRotation * 0.3] as [
          number,
          number,
          number,
        ],
        scale: 1 + Math.sin(scrollProgress * Math.PI * 2 + angle) * 0.2,
      }
    })
  }, [cards, scrollProgress])

  // Animate camera based on scroll
  useFrame(() => {
    const cameraAngle = scrollProgress * Math.PI * 2
    camera.position.x = Math.cos(cameraAngle) * 6
    camera.position.z = Math.sin(cameraAngle) * 6
    camera.position.y = 1 + Math.sin(scrollProgress * Math.PI) * 0.5
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[6, 1, 0]} fov={50} near={0.1} far={1000} />

      {/* Lighting */}
      <AmbientLight intensity={0.6} />
      <PointLight position={[5, 5, 5]} intensity={1.2} color="#A4F4FD" />
      <PointLight position={[-5, 3, -5]} intensity={0.8} color="#00d2ff" />
      <PointLight position={[0, -2, 0]} intensity={0.5} color="#ffffff" />

      {/* Render cards */}
      {cards.map((card, index) => (
        <Card3D
          key={card.id}
          data={card}
          position={cardConfigs[index].position}
          rotation={cardConfigs[index].rotation}
          scale={cardConfigs[index].scale}
        />
      ))}

      {/* Center reference */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#A4F4FD" />
      </mesh>
    </>
  )
}

export function Scene3D({ scrollProgress, cards }: Scene3DProps) {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        background: 'transparent',
        width: '100%',
        height: '100%',
      }}
    >
      <Scene3DContent scrollProgress={scrollProgress} cards={cards} />
    </Canvas>
  )
}
