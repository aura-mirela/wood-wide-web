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

export default function PreviousButton({ onClick }) {
  return (
    <button type="button" className="previous-button" onClick={onClick} aria-label="Previous chapter">
      <svg {...svgProps}>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </svg>
    </button>
  )
}
