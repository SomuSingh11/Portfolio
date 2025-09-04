const LinkRenderer = ({ text }: { text: string }) => {
  const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = text.split(urlRegex);

  return (
    <span>
      {parts.map((part, index) => {
        // Every 3rd part is the link text, and the next is the URL
        if (index % 3 === 1) {
          const url = parts[index + 1];
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {part}
            </a>
          );
        }
        // These are the separators between links, like " | "
        if (index % 3 === 2) {
          return null;
        }
        // This is the regular text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default LinkRenderer;
