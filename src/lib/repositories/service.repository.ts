import "server-only";

import type { Service } from "@/types";
import { SERVICE_DATA } from "@/lib/data/service.data";

function isVisible(service: Service): boolean {
  return service.isPublished;
}

export async function getAllServices(): Promise<Service[]> {
  return SERVICE_DATA.filter(isVisible).sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const service = SERVICE_DATA.find((s) => s.slug === slug && isVisible(s));
  return service ?? null;
}
