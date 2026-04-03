import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, RoundedBox } from '@react-three/drei';

const shellPositions = [
  [-2.7, -0.2, 0],
  [-0.9, -0.2, 0],
  [0.9, -0.2, 0],
  [2.7, -0.2, 0],
];

function BeachBackdrop() {
  return (
    <group>
      <mesh position={[0, 3.2, -8]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#89d7ff" />
      </mesh>
      <mesh position={[0, 0.8, -7.8]}>
        <planeGeometry args={[20, 3.2]} />
        <meshBasicMaterial color="#22bee4" />
      </mesh>
      <mesh position={[0, -2.4, -7.6]}>
        <planeGeometry args={[20, 5]} />
        <meshBasicMaterial color="#efd596" />
      </mesh>
      <mesh position={[5.8, 3.3, -6.8]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial emissive="#ffd978" emissiveIntensity={1.4} color="#fff0bc" />
      </mesh>
    </group>
  );
}

function Table() {
  return (
    <group position={[0, -1.15, 0]}>
      <RoundedBox args={[9.2, 0.38, 3.6]} radius={0.16} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#ddb07a" roughness={0.52} />
      </RoundedBox>
      <RoundedBox args={[8.4, 0.14, 3]} radius={0.12} position={[0, 0.18, 0]} receiveShadow>
        <meshStandardMaterial color="#f4dbb2" roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.1, 3.5, 0.8, 32]} />
        <meshStandardMaterial color="#b56f3f" roughness={0.72} />
      </mesh>
    </group>
  );
}

function Dealer({ activeIndex, phase }) {
  const targetX = activeIndex >= 0 ? shellPositions[activeIndex][0] * 0.9 : 0;
  const handY = phase === 'placing' ? 0.95 : 1.18;

  return (
    <group position={[0, 0.85, 1.25]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.42, 28, 28]} />
        <meshStandardMaterial color="#efbb96" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.8, 0.04]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color="#2f2342" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.48, 1.2, 10, 18]} />
        <meshStandardMaterial color="#f46ca4" roughness={0.6} />
      </mesh>
      <mesh position={[-0.28, -0.68, 0]} rotation={[0.04, 0, 0.06]} castShadow>
        <capsuleGeometry args={[0.12, 1.05, 8, 12]} />
        <meshStandardMaterial color="#2d2f68" roughness={0.76} />
      </mesh>
      <mesh position={[0.28, -0.68, 0]} rotation={[0.04, 0, -0.06]} castShadow>
        <capsuleGeometry args={[0.12, 1.05, 8, 12]} />
        <meshStandardMaterial color="#2d2f68" roughness={0.76} />
      </mesh>
      <mesh position={[-0.82, 0.56, 0.08]} rotation={[0, 0, -0.95]} castShadow>
        <capsuleGeometry args={[0.11, 0.9, 8, 12]} />
        <meshStandardMaterial color="#efbb96" roughness={0.55} />
      </mesh>
      <group position={[targetX * 0.62, 0.82, 0.12]}>
        <mesh position={[targetX * 0.25, 0, 0]} rotation={[0, 0, -1.02]} castShadow>
          <capsuleGeometry args={[0.11, 1.18, 8, 12]} />
          <meshStandardMaterial color="#efbb96" roughness={0.55} />
        </mesh>
        <mesh position={[targetX * 0.48, handY - 0.82, 0.04]} rotation={[0.25, 0, 0.18]} castShadow>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#efbb96" roughness={0.55} />
        </mesh>
        <mesh position={[targetX * 0.56, handY - 1.02, 0.08]} rotation={[0.15, 0, 0.08]} castShadow>
          <boxGeometry args={[0.38, 0.28, 0.24]} />
          <meshStandardMaterial color="#e3a47f" roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

function GiftToken({ visible, lifted }) {
  if (!visible) {
    return null;
  }

  return (
    <Float speed={2.1} rotationIntensity={0.3} floatIntensity={0.18}>
      <group position={[0, lifted ? 0.2 : -0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial color="#f46ca4" roughness={0.35} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0, 0.22]}>
          <boxGeometry args={[0.08, 0.44, 0.04]} />
          <meshStandardMaterial color="#fff5f8" />
        </mesh>
        <mesh position={[0, 0.21, 0.22]}>
          <boxGeometry args={[0.44, 0.08, 0.04]} />
          <meshStandardMaterial color="#fff5f8" />
        </mesh>
      </group>
    </Float>
  );
}

function Shell({ position, isWinning, phase, onPick }) {
  const lifted = phase === 'placing' && isWinning;
  const canPick = phase === 'choose';

  return (
    <group position={[position[0], lifted ? 0.42 : 0.12, position[2]]} onClick={() => canPick && onPick()}>
      <GiftToken visible={isWinning && phase === 'placing'} lifted={lifted} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.66, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d89957" roughness={0.44} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.02, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.72, 0.5, 32]} />
        <meshStandardMaterial color="#9f5e2f" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.88, 0.08, 32]} />
        <meshStandardMaterial color="#76421f" roughness={0.76} />
      </mesh>
    </group>
  );
}

function ShellGameWorld({ orderedPots, winningPotId, phase, onPick }) {
  const activeIndex = orderedPots.findIndex((pot) => pot.id === winningPotId);

  return (
    <>
      <color attach="background" args={['#8dd7ff']} />
      <fog attach="fog" args={['#8dd7ff', 10, 18]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
      <pointLight position={[5.8, 3.4, 2]} intensity={26} distance={14} color="#ffd978" />

      <BeachBackdrop />
      <Table />
      <Dealer activeIndex={activeIndex} phase={phase} />

      {orderedPots.map((pot, index) => (
        <Shell
          key={pot.id}
          position={shellPositions[index]}
          isWinning={pot.id === winningPotId}
          phase={phase}
          onPick={() => onPick(pot.id)}
        />
      ))}

      <ContactShadows position={[0, -1.5, 0]} opacity={0.34} scale={14} blur={2.4} far={4.8} />
    </>
  );
}

function LevelTwoScene({ orderedPots, winningPotId, phase, onPick }) {
  return (
    <div className="level-two-canvas">
      <Canvas camera={{ position: [0, 1.2, 6.8], fov: 30 }} shadows>
        <ShellGameWorld
          orderedPots={orderedPots}
          winningPotId={winningPotId}
          phase={phase}
          onPick={onPick}
        />
      </Canvas>
    </div>
  );
}

export default LevelTwoScene;
