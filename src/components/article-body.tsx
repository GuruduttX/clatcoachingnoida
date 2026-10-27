// Renders rich text written in the admin editor. Content comes only from
// signed-in admins, so it is trusted HTML.
export function ArticleBody({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-app ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
