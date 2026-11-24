import './demo-style.css'

export default function DemoUI({ isScaling, setIsScaling, changeColor }) {
  return (
    <div className="demo-ui">
      <div className="demo-controls">
        <button onClick={() => setIsScaling(!isScaling)}>
          {isScaling ? 'Stop Scaling' : 'Start Scaling'}
        </button>

        <button onClick={changeColor}>
          Change Color
        </button>
      </div>
    </div>
  )
}