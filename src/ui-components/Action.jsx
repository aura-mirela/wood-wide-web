export default function Action({ icon, label }) {
  if (!label) {
    return null
  }

  return (
    <div className="action">
      {icon}
      <div className="action-content">{label}</div>
    </div>
  )
}
