"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Stars, Line } from "@react-three/drei"
import * as THREE from "three"

const SATELLITE_COUNT = 12
const GLOBE_RADIUS = 2
const NODE_COUNT = 120

function getGlobeVertex(index: number, total: number): THREE.Vector3 {
  const phi = Math.acos(-1 + (2 * index) / total)
  const theta = Math.sqrt(total * Math.PI) * phi
  return new THREE.Vector3(
    GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta),
    GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta),
    GLOBE_RADIUS * Math.cos(phi),
  )
}

interface SatelliteData {
  radius: number
  speed: number
  inclination: number
  phase: number
  targetNodeIndex: number
}

function useSatelliteData(): SatelliteData[] {
  return useMemo(() => {
    const data: SatelliteData[] = []
    for (let i = 0; i < SATELLITE_COUNT; i++) {
      data.push({
        radius: GLOBE_RADIUS * (1.8 + Math.random() * 1.6),
        speed: 0.2 + Math.random() * 0.5,
        inclination: (Math.random() - 0.5) * Math.PI * 0.7,
        phase: Math.random() * Math.PI * 2,
        targetNodeIndex: Math.floor(Math.random() * NODE_COUNT),
      })
    }
    return data
  }, [])
}

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const geoRef = useRef<THREE.SphereGeometry>(null!)

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.08
  })

  const positions = useMemo(() => {
    const pos: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const v = getGlobeVertex(i, NODE_COUNT)
      pos.push(v.x, v.y, v.z)
    }
    return new Float32Array(pos)
  }, [])

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry ref={geoRef} args={[GLOBE_RADIUS, 48, 48]} />
        <meshBasicMaterial
          color="#8B5CF6"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#A78BFA"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function Satellite({ data }: { data: SatelliteData }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime * data.speed + data.phase
    groupRef.current.rotation.x = data.inclination
    const x = data.radius * Math.cos(t)
    const z = data.radius * Math.sin(t)
    meshRef.current.position.set(x, 0, z)
    meshRef.current.rotation.x = state.clock.elapsedTime * 2
    meshRef.current.rotation.z = state.clock.elapsedTime * 1.5
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshBasicMaterial color="#C4B5FD" />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        distance={0.5}
        intensity={0.3}
        color="#8B5CF6"
      />
    </group>
  )
}

function DataLinks({ satellites }: { satellites: SatelliteData[] }) {
  const { nodes, active } = useMemo(() => {
    const nodePositions: THREE.Vector3[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePositions.push(getGlobeVertex(i, NODE_COUNT))
    }
    return { nodes: nodePositions, active: true }
  }, [])

  const lines = useMemo(() => {
    const result: { points: THREE.Vector3[]; key: number }[] = []
    for (let s = 0; s < satellites.length; s++) {
      const sat = satellites[s]
      const startAngle = sat.phase
      const startPos = new THREE.Vector3(
        sat.radius * Math.cos(startAngle),
        0,
        sat.radius * Math.sin(startAngle),
      )
      startPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.inclination)
      const endPos = nodes[sat.targetNodeIndex]
      const mid = startPos.clone().add(endPos).multiplyScalar(0.5)
      mid.y += 1.2

      const curve = new THREE.QuadraticBezierCurve3(startPos, mid, endPos)
      const curvePoints = curve.getPoints(20)
      result.push({ points: curvePoints, key: s })
    }
    return result
  }, [satellites, nodes])

  return (
    <group>
      {lines.map(({ points, key }) => (
        <Line
          key={key}
          points={points}
          color="#8B5CF6"
          lineWidth={0.5}
          transparent
          opacity={0.25}
        />
      ))}
    </group>
  )
}

function GlobeContent({ zoomLevel }: { zoomLevel: number }) {
  const satelliteData = useSatelliteData()
  const satScale = Math.min(1, Math.max(0.15, (zoomLevel - 1.5) / 3))
  const linkOpacity = Math.min(1, Math.max(0, (zoomLevel - 2) / 3))

  return (
    <>
      <GlobeMesh />
      <DataLinks satellites={satelliteData} />
      <group scale={satScale}>
        {satelliteData.map((data, i) => (
          <Satellite key={i} data={data} />
        ))}
      </group>
    </>
  )
}

function CameraTracker({
  onZoom,
}: {
  onZoom: (level: number) => void
}) {
  const { camera } = useThree()
  useFrame(() => {
    const dist = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
    onZoom(dist)
  })
  return null
}

export default function Globe3D() {
  const [zoomLevel, setZoomLevel] = useState(6)

  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <GlobeContent zoomLevel={zoomLevel} />
        <OrbitControls
          enablePan={false}
          minDistance={2.4}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
        />
        <CameraTracker onZoom={setZoomLevel} />
      </Canvas>
    </div>
  )
}
