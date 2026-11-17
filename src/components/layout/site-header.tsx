import Link from "next/link";

const navigation = ["Platform", "Operations", "Analytics", "Roadmap"];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200/80 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
            Z
          </span>
          <span className="text-sm font-semibold tracking-wide">
            Zuki Commerce OS
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          {navigation.map((item) => (
            <a
              className="transition-colors hover:text-zinc-950 dark:hover:text-white"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
