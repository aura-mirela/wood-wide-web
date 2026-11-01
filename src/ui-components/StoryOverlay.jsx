import { useState } from 'react'
import { chapters } from '../story/storyText'
import StoryChapter from './StoryChapter'
import NextButton from './NextButton'
import PreviousButton from './PreviousButton'
import './story-overlay.css'

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

export default function StoryOverlay() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [minimized, setMinimized] = useState(false)

  const onNextChapter = () => setChapterIndex(
    chapterIndex + 1 < chapters.length ? chapterIndex + 1 : 0
  )

  const onPreviousChapter = () => setChapterIndex(
    chapterIndex - 1 >= 0 ? chapterIndex - 1 : chapters.length - 1
  )

  if (minimized) {
    return <ExpandButton onClick={() => setMinimized(false)} />
  }

  return (
    <div className="story-overlay">
      <MinimizeButton onClick={() => setMinimized(true)} />
      <NextButton onClick={onNextChapter} />
      <PreviousButton onClick={onPreviousChapter} />
      <StoryChapter
        title={chapters[chapterIndex].title}
        body={chapters[chapterIndex].body}
        source={chapters[chapterIndex].source}
        credits={chapters[chapterIndex].credits}
      />
    </div>
  )
}
