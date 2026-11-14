import { useState } from 'react'

import DemoExperience from './demo/DemoExperience'
import DemoUI from './demo/DemoUI'

export default function AppDemo() {

    const [isScaling, setIsScaling] = useState(true)
    const [color, setColor] = useState('red')

    
    // todo: change color to a random color from the array
    const changeColor = () => {
        const colors = ['green', 'red', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray']
        console.log(colors[Math.floor(Math.random() * colors.length)])
        setColor(colors[Math.floor(Math.random() * colors.length)])
    }

  return (
    <>
      <DemoExperience isScaling={isScaling} color={color} />
      <DemoUI isScaling={isScaling} setIsScaling={setIsScaling} changeColor={changeColor} />
    </>
  )
}