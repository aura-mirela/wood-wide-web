import { useState } from 'react'
import './App.css'

import Experience from './Experience'
import StoryOverlay from './ui-components/StoryOverlay'
function App() {
  const [cameraFocus, setCameraFocus] = useState(null)
  const [mushroomClickId, setMushroomClickId] = useState(0)
  const [firClickId, setFirClickId] = useState(0)

  return (
    <>
      <Experience
        cameraFocus={cameraFocus}
        onCameraFocus={setCameraFocus}
        onMushroomClick={() => setMushroomClickId((id) => id + 1)}
        onFirClick={() => setFirClickId((id) => id + 1)}
      />
      <StoryOverlay mushroomClickId={mushroomClickId} firClickId={firClickId} />
    </>
  )
}

export default App
