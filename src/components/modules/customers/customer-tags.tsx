interface CustomerTagsProps {
  tags: string[];
}

export function CustomerTags({ tags }: CustomerTagsProps) {
  if (tags.length === 0) {
    return <span className="text-sm text-zinc-500">Sin tags</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
          key={tag}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
