import DemoControls from './DemoControls'
import './demo-style.css'

export default function DemoUI({isScaling, setIsScaling, changeColor}) {
  return (
    <div className="demo-ui">
      <DemoControls isScaling={isScaling} setIsScaling={setIsScaling} changeColor={changeColor} />
    </div>
  )
}