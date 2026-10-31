import { Environment } from "@react-three/drei"

export default function SceneEnvironment() {

    const  SKY_HDR_URL = '/textures/env-maps/NightSkyHDRI003_1K_HDR.hdr'

    return (
        <>
        <Environment
            files={SKY_HDR_URL}
            background
            backgroundIntensity={0.2}
            backgroundRotation={[0, -Math.PI / 2, 0]}
            environmentIntensity={0.2}
            environmentRotation={[0, -Math.PI / 2, 0]}
        />
        </>
    )
}