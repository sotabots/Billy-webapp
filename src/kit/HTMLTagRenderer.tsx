import DOMPurify from 'dompurify'

type TProps = {
  string: string
  allowedTags: string[]
}

const HTMLTagRenderer = ({ string, allowedTags }: TProps) => {
  const cleanHTML = DOMPurify.sanitize(string, { ALLOWED_TAGS: allowedTags })

  return (
    <span dangerouslySetInnerHTML={{ __html: cleanHTML }} />
  )
}

export default HTMLTagRenderer
