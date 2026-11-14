export default function DemoControls({isScaling, setIsScaling, changeColor}) {

  return (
    <div className="demo-controls">
        <button onClick={() => setIsScaling(!isScaling)}>
            {isScaling ? 'Stop Scaling' : 'Start Scaling'}
        </button>
        
        <button onClick={() => changeColor()}>
            {"Change Color"}
        </button>
    </div>
  )
}