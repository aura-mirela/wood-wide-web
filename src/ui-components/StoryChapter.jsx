function Attribution({ source, credits }) {
  if (!source && !credits) {
    return null
  }

  return (
    <>
      <br />
      {source && (
        <p>
          Source:{' '}
          <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
        </p>
      )}
      {credits && (
        <p>
          Credits:{' '}
          <a href={credits.url} target="_blank" rel="noreferrer">{credits.text}</a>
        </p>
      )}
    </>
  )
}

export default function StoryChapter({ title, body, source, credits }) {
  return (
    <div className="story-chapter">
      <h1>{title}</h1>
      <div className="story-chapter-content">
        {Array.isArray(body)
          ? body.map((line, index) => (
              <p key={`${line.label}-${index}`}>
                {line.label}:{' '}
                {line.emphasis === 'bold'
                  ? <strong className="taxonomy-value">{line.value}</strong>
                  : <em className="taxonomy-value">{line.value}</em>}
              </p>
            ))
          : body?.contains
            ? (
                <>
                  <p>{body.text}</p>
                  <ul>
                    {body.contains.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {body.note && <p>{body.note}</p>}
                </>
              )
            : body}
        <Attribution source={source} credits={credits} />
      </div>
    </div>
  )
}
