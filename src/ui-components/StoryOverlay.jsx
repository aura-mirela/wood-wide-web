import { useState } from 'react'
import { enterTheForest, fungalIndividual, meetTheFirs, meetTheMushroom } from '../story/storyText'
import StoryChapter from './StoryChapter'
import NextButton from './NextButton'
import PreviousButton from './PreviousButton'
import './story-overlay.css'

const stories = {
  enter: enterTheForest,
  fir: meetTheFirs,
  mushroom: meetTheMushroom,
  fungal: fungalIndividual,
}

const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

function MinimizeButton({ onClick }) {
  return (
    <button type="button" className="overlay-minimize" onClick={onClick} aria-label="Hide story">
      <svg {...svgProps}>
        <path d="M8 3v3a2 2 0 0 1-2 2H3" />
        <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
        <path d="M3 16h3a2 2 0 0 1 2 2v3" />
        <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
      </svg>
    </button>
  )
}

function ExpandButton({ onClick }) {
  return (
    <button type="button" className="overlay-expand" onClick={onClick} aria-label="Show story">
      <svg {...svgProps}>
        <path d="m15 15 6 6" />
        <path d="m15 9 6-6" />
        <path d="M21 16v5h-5" />
        <path d="M21 8V3h-5" />
        <path d="M3 16v5h5" />
        <path d="m3 21 6-6" />
        <path d="M3 8V3h5" />
        <path d="M9 9 3 3" />
      </svg>
    </button>
  )
}

function previousPage(page, firDiscovered) {
  if (page === 'fungal') {
    return 'mushroom'
  }
  if (page === 'mushroom') {
    return firDiscovered ? 'fir' : 'enter'
  }
  if (page === 'fir') {
    return 'enter'
  }
  return null
}

function nextPage(page, { firDiscovered, mushroomDiscovered }) {
  if (page === 'mushroom') {
    return 'fungal'
  }
  if (page === 'fir') {
    return mushroomDiscovered ? 'mushroom' : null
  }
  if (page === 'enter') {
    if (firDiscovered) {
      return 'fir'
    }
    if (mushroomDiscovered) {
      return 'mushroom'
    }
  }
  return null
}

export default function StoryOverlay({ mushroomClickId = 0, firClickId = 0 }) {
  const [page, setPage] = useState('enter')
  const [minimizedOverlay, setMinimizedOverlay] = useState(false)
  const [firDiscovered, setFirDiscovered] = useState(false)
  const [mushroomDiscovered, setMushroomDiscovered] = useState(false)
  const [seenMushroomClickId, setSeenMushroomClickId] = useState(mushroomClickId)
  const [seenFirClickId, setSeenFirClickId] = useState(firClickId)

  // A further click on the species already open leaves the overlay as it is.
  if (mushroomClickId !== seenMushroomClickId) {
    setSeenMushroomClickId(mushroomClickId)
    if (!(page === 'mushroom' && !minimizedOverlay)) {
      setMushroomDiscovered(true)
      setPage('mushroom')
      setMinimizedOverlay(false)
    }
  }

  if (firClickId !== seenFirClickId) {
    setSeenFirClickId(firClickId)
    if (!(page === 'fir' && !minimizedOverlay)) {
      setFirDiscovered(true)
      setPage('fir')
      setMinimizedOverlay(false)
    }
  }

  const discovery = { firDiscovered, mushroomDiscovered }
  const previousId = previousPage(page, firDiscovered)
  const nextId = nextPage(page, discovery)
  const story = stories[page]

  if (minimizedOverlay) {
    return <ExpandButton onClick={() => setMinimizedOverlay(false)} />
  }

  return (
    <div className="story-overlay">
      <MinimizeButton onClick={() => setMinimizedOverlay(true)} />
      {nextId && <NextButton onClick={() => setPage(nextId)} />}
      {previousId && <PreviousButton onClick={() => setPage(previousId)} />}
      <StoryChapter
        title={story.title}
        body={story.body}
        source={story.source}
        credits={story.credits}
      />
    </div>
  )
}
