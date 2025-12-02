// app/(marketing)/portfolio/[slug]/page.tsx
import { promises as fs } from "node:fs";
import path from "node:path";

type CaseStudySection = {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
};

type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry?: string;
  year?: string;
  summary: string;
  services: string[];
  results?: {
    label: string;
    value: string;
  }[];
  sections: CaseStudySection[];
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Load data from content/portfolio/<slug>.json
async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "portfolio",
      `${slug}.json`
    );

    const file = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(file) as CaseStudy;

    return data;
  } catch (error) {
    console.error("Failed to load case study", slug, error);
    return null;
  }
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-2xl font-semibold">Case study not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          The case study you are looking for does not exist or has been moved.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      {/* Eyebrow */}
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
        Portfolio / Case Study
      </p>

      {/* Hero */}
      <header className="mt-4 flex flex-col gap-8 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {caseStudy.title}
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            {caseStudy.summary}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-xs text-neutral-300 md:grid-cols-3">
            <div>
              <dt className="font-medium text-neutral-100">Client</dt>
              <dd className="mt-1">{caseStudy.client}</dd>
            </div>
            {caseStudy.industry && (
              <div>
                <dt className="font-medium text-neutral-100">Industry</dt>
                <dd className="mt-1">{caseStudy.industry}</dd>
              </div>
            )}
            {caseStudy.year && (
              <div>
                <dt className="font-medium text-neutral-100">Year</dt>
                <dd className="mt-1">{caseStudy.year}</dd>
              </div>
            )}
          </dl>

          {caseStudy.services.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                Services
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                {caseStudy.services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-neutral-700 px-3 py-1 text-neutral-100"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Impact */}
      {caseStudy.results && caseStudy.results.length > 0 && (
        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-6 py-5">
          <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            Impact
          </h2>
          <dl className="mt-4 grid gap-6 text-sm text-neutral-100 md:grid-cols-3">
            {caseStudy.results.map((item) => (
              <div key={item.label}>
                <dt className="text-neutral-400">{item.label}</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Sections */}
      <section className="mt-14 space-y-12">
        {caseStudy.sections.map((section) => (
          <article key={section.id} id={section.id}>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-50">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="mt-1 text-sm text-neutral-500">
                {section.subtitle}
              </p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              {section.body}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
