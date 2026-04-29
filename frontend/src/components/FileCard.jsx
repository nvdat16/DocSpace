export default function FileCard({ title = 'Untitled', description = '' }) {
  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem' }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
