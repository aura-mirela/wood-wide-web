import { useState } from 'react'

import DemoExperience from './demo/DemoExperience'
import DemoUI from './demo/DemoUI'

export default function AppDemo() {

    const [isScaling, setIsScaling] = useState(true)
    const [color, setColor] = useState('red')

    
    const changeColor = () => {
      const colors = ['green', 'red', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray']
      const nextColor = colors[Math.floor(Math.random() * colors.length)]
      console.log(nextColor)
      setColor(nextColor)
    }

  return (
    <>
      <DemoExperience isScaling={isScaling} color={color} />
      <DemoUI isScaling={isScaling} setIsScaling={setIsScaling} changeColor={changeColor} />
    </>
  )
}