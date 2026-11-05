import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Footer } from "@/components/landing/footer";
import { Nav } from "@/components/landing/nav";
import { frame } from "@/components/landing/styles";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageAlternates } from "@/lib/seo";

const slugs = ["mentions", "privacy", "terms", "cookies"] as const;
type Slug = (typeof slugs)[number];

type Section = {
  heading: string;
  paragraphs?: string[];
  items?: { label: string; value: string }[];
};
type LegalPage = { title: string; description: string; sections: Section[] };

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

function isSlug(slug: string): slug is Slug {
  return (slugs as readonly string[]).includes(slug);
}

async function loadPage(locale: string, slug: string) {
  if (!isSlug(slug)) notFound();
  const t = await getTranslations({ locale, namespace: "legal" });
  const page = t.raw(`pages.${slug}`) as LegalPage;
  const todo = t("todo");
  return { t, page, todo, incomplete: JSON.stringify(page).includes(todo) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const { page, incomplete } = await loadPage(locale, slug);
  return {
    title: `${page.title} | Payskool`,
    description: page.description,
    alternates: pageAlternates(locale, `/legal/${slug}`),
    // A legal page with missing facts must not be indexed as if it were final.
    ...(incomplete && { robots: { index: false, follow: true } }),
  };
}

const token = /(\[[^\]]+\]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;

/** Marks the facts still to be filled in, and turns email addresses into links. */
function Rich({ text, todo }: { text: string; todo: string }): ReactNode {
  return text.split(token).map((part, index) => {
    if (part === todo) {
      return (
        <span key={index} className="rounded bg-ambre/10 px-1.5 py-0.5 text-amber-900">
          {part}
        </span>
      );
    }
    if (part.includes("@") && token.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className="font-medium text-emerald-700 underline decoration-emeraude/40 underline-offset-4 hover:decoration-emeraude"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default async function LegalPageRoute({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { t, page, todo } = await loadPage(locale, slug);
  const footer = await getTranslations({ locale, namespace: "footer" });

  return (
    <>
      <Nav />
      <main className={`${frame} py-16 sm:py-24`}>
        <div className="max-w-3xl">
          <nav aria-label={t("navLabel")}>
            <ul className="flex flex-wrap gap-2">
              {slugs.map((other) => (
                <li key={other}>
                  <Link
                    href={`/legal/${other}`}
                    aria-current={other === slug ? "page" : undefined}
                    className="inline-flex min-h-10 items-center rounded-lg border border-fil bg-white px-3 text-[14px] text-encre/80 hover:border-encre/30 hover:text-encre aria-[current=page]:border-encre aria-[current=page]:font-semibold aria-[current=page]:text-encre"
                  >
                    {footer(other)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <h1 className="display-heading mt-12 text-[2.2rem] text-encre sm:text-[2.8rem]">
            {page.title}
          </h1>
          <p className="mt-3 text-[14px] text-encre/65">{t("lastUpdated")}</p>

          <div className="mt-12 space-y-12">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-[1.25rem] font-bold text-encre">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-[16px] leading-relaxed text-encre/80">
                    <Rich text={paragraph} todo={todo} />
                  </p>
                ))}
                {section.items && (
                  <dl className="mt-4 divide-y divide-fil border-y border-fil">
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4"
                      >
                        <dt className="text-[14px] font-medium text-encre/65">{item.label}</dt>
                        <dd className="text-[15px] text-encre">
                          <Rich text={item.value} todo={todo} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
