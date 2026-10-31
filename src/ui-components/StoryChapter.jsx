export default function StoryChapter({ title, body }) {
  return (
    <div className="story-chapter">
      <h1>{title}</h1>
      <div className="story-chapter-content">{body}</div>
    </div>
  )
}
