import { useState } from 'react'
import './App.css'

import Experience from './Experience'
import StoryOverlay from './ui-components/StoryOverlay'
function App() {
  const [cameraFocus, setCameraFocus] = useState(null)

  return (
    <>
      <Experience cameraFocus={cameraFocus} onCameraFocus={setCameraFocus} />
      <StoryOverlay />
    </>
  )
}

export default App
