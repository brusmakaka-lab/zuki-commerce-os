const metrics = [
  { label: "Channels", value: "08" },
  { label: "Workflows", value: "24" },
  { label: "Signals", value: "Realtime" },
];

const modules = [
  "Catalog control",
  "Order operations",
  "Customer timeline",
  "Revenue insights",
];

export function LandingPage() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-300">
            Commerce operations, without the noise
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-6xl">
            Zuki Commerce OS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            A clean foundation for building the back office of a modern
            commerce business: products, orders, customers, reporting, and team
            workflows in one focused workspace.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              href="#platform"
            >
              View platform
            </a>
            <a
              className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              href="#roadmap"
            >
              See roadmap
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-zinc-950 dark:text-white">
                Operations Overview
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Temporary product surface
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              Setup
            </span>
          </div>

          <div className="grid gap-3 py-5 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
                key={metric.label}
              >
                <p className="font-mono text-xl font-semibold">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3" id="operations">
            {modules.map((module) => (
              <div
                className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3 dark:border-zinc-800"
                key={module}
              >
                <span className="text-sm font-medium">{module}</span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3">
        <div id="platform">
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            Platform
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            App Router, TypeScript, Tailwind, and import aliases are ready for
            product work.
          </p>
        </div>
        <div id="analytics">
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            Analytics
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            The surface is prepared for future reporting modules without
            coupling it to a database yet.
          </p>
        </div>
        <div id="roadmap">
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            Roadmap
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Auth, Prisma, shadcn/ui components, and commerce workflows can be
            added incrementally.
          </p>
        </div>
      </div>
    </section>
  );
}
