type SectionHeadingProps = {
  id: string
  title: string
  description: string
}

export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </header>
  )
}
