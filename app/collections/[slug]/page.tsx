import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import ModuleClient from "@/components/ModuleClient";
import { MODULES, getModule } from "@/lib/products";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const module = getModule(slug);
  if (!module) return { title: "Not found — Bakes by Mom" };
  return {
    title: `${module.name} — Bakes by Mom`,
    description: module.description,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getModule(slug);
  if (!module) notFound();

  return (
    <SiteShell>
      <ModuleClient module={module} />
    </SiteShell>
  );
}
