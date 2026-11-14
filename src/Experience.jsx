import { Canvas } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useState, Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Moon, { MOON_POSITION } from './3d-components/Moon'
import Stars from './3d-components/Stars'
import SceneControls from './SceneControls'
import Terrain from './3d-components/Terrain'
import { useBreakpoints } from './breakpoints/useBreakpoints'
import { getSceneTier, getSceneTierName, sceneTierHasShadows } from './breakpoints/getSceneTier'

export const mainColor = '#1c3668'

// Moon, stars, and the story text stay light tints of mainColor.
const LIGHTNESS = 0.9
// Top of the page gradient. Same hue as mainColor, kept very dark.
const SKY_LIGHTNESS = 0.1

function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function rgbToHsl(r, g, b) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const lightness = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l: lightness }
  }

  const delta = max - min
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  let hue
  if (max === rn) {
    hue = (gn - bn) / delta + (gn < bn ? 6 : 0)
  } else if (max === gn) {
    hue = (bn - rn) / delta + 2
  } else {
    hue = (rn - gn) / delta + 4
  }

  return { h: hue / 6, s: saturation, l: lightness }
}

function hueToChannel(p, q, t) {
  let channel = t
  if (channel < 0) channel += 1
  if (channel > 1) channel -= 1
  if (channel < 1 / 6) return p + (q - p) * 6 * channel
  if (channel < 1 / 2) return q
  if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6
  return p
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const value = Math.round(l * 255)
    return [value, value, value]
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hueToChannel(p, q, h + 1 / 3) * 255),
    Math.round(hueToChannel(p, q, h) * 255),
    Math.round(hueToChannel(p, q, h - 1 / 3) * 255),
  ]
}

function withLightness(hex, lightness) {
  const [r, g, b] = hexToRgb(hex)
  const { h, s } = rgbToHsl(r, g, b)
  const [rr, gg, bb] = hslToRgb(h, s, lightness)
  return `#${[rr, gg, bb].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function rgbUnits(hex) {
  return hexToRgb(hex).map((channel) => channel / 255)
}

function cssHsl(hex, lightness) {
  const [r, g, b] = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  const level = lightness ?? hsl.l
  return `${Math.round(hsl.h * 360)} ${Math.round(hsl.s * 100)}% ${Math.round(level * 100)}%`
}

function applyMainColor(hex) {
  const root = document.documentElement.style
  root.setProperty('--moonlight', cssHsl(hex, LIGHTNESS))
  root.setProperty('--main-color', hex)
  root.setProperty('--sky-top', cssHsl(hex, SKY_LIGHTNESS))
}

applyMainColor(mainColor)

const MOON_LIGHT_DISTANCE = 5

function lightPositionFromMoon(moonPosition, distance) {
  const [x, y, z] = moonPosition
  const horizontal = Math.hypot(x, z) || 1
  const scale = distance / horizontal
  return [x * scale, y, z * scale]
}

const moonLightPosition = lightPositionFromMoon(MOON_POSITION, MOON_LIGHT_DISTANCE)

export default function Experience({ cameraFocus, onCameraFocus }) {
  const [color, setColor] = useState(mainColor)
  const moonColor = useMemo(() => withLightness(color, LIGHTNESS), [color])
  const glowColor = useMemo(() => rgbUnits(color), [color])

  const { isXs, isSm, isMd, isPortrait } = useBreakpoints()
  const tierName = getSceneTierName({ isXs, isSm, isMd })
  const tier = getSceneTier({ isXs, isSm, isMd, isPortrait })
  const [forcedShadowTiers, setForcedShadowTiers] = useState(() => new Set())
  const shadows = tier.shadows || forcedShadowTiers.has(tierName)

  const handleTierChange = useCallback((name) => {
    if (sceneTierHasShadows(name)) {
      return
    }
    setForcedShadowTiers((current) => {
      if (current.has(name)) {
        return current
      }
      const next = new Set(current)
      next.add(name)
      return next
    })
  }, [])

  useEffect(() => {
    applyMainColor(color)
  }, [color])

  return (
    <Canvas
      dpr={tier.dpr}
      camera={tier.camera}
      shadows={shadows ? 'percentage' : false}
    >
      <SceneControls
        mainColor={mainColor}
        onMainColorChange={setColor}
        tierName={tierName}
        onTierChange={handleTierChange}
        lightPosition={moonLightPosition}
        castShadow={shadows}
      />
      <OrbitControls
        target={[-2, 1, -3.5]}
        minAzimuthAngle={0.13 - 0.2}
        maxAzimuthAngle={0.13 + 0.7}
        minPolarAngle={1.51}
        maxPolarAngle={1.51}
        minDistance={tier.minDistance}
        maxDistance={tier.maxDistance}
      />

      <Stars color={moonColor} />
      <Suspense fallback={null}>
        <Moon color={moonColor} glowColor={glowColor} />
        <Terrain
          segments={tier.segments}
          treeCount={tier.treeCount}
          mushroomCount={tier.mushroomCount}
          bumpMap={tier.bumpMap}
          cameraFocus={cameraFocus}
          onCameraFocus={onCameraFocus}
         />
      </Suspense>
    </Canvas>
  )
}
