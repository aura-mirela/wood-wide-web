const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '22',
  height: '22',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export default function NextButton({ onClick }) {
  return (
    <button type="button" className="next-button" onClick={onClick} aria-label="Next chapter">
      <svg {...svgProps}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </button>
  )
}
