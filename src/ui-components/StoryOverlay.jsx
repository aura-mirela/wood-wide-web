import { useState } from 'react'
import { chapters } from '../story/storyText'
import { icons } from '../story/iconMap'
import StoryChapter from './StoryChapter'
import Action from './Action'
import NextButton from './NextButton'
import PreviousButton from './PreviousButton'
import './story-overlay.css'

const FIRST_CHAPTER_ID = 'enter-the-forest'
const NEXT_CHAPTER_ID = 'meet-the-mushroom'

export default function StoryOverlay() {
  const [chapterId, setChapterId] = useState(FIRST_CHAPTER_ID)
  const chapter = chapters.find((candidate) => candidate.id === chapterId)

  return (
    <div className="story-overlay">
      {chapterId === NEXT_CHAPTER_ID && (
        <PreviousButton onClick={() => setChapterId(FIRST_CHAPTER_ID)} />
      )}
      {chapterId === FIRST_CHAPTER_ID && (
        <NextButton onClick={() => setChapterId(NEXT_CHAPTER_ID)} />
      )}
      <StoryChapter title={chapter.title} body={chapter.body} />
      <Action icon={icons[chapter.action?.icon]} label={chapter.action?.label} />
    </div>
  )
}
