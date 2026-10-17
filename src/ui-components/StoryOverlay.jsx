import StoryChapter from './StoryChapter'
import Action from './Action'
import './story-overlay.css'

export default function StoryOverlay() {
  return (
    <div className="story-overlay">
      <StoryChapter />
      <br /> <br />
      <Action />
    </div>
  )
}