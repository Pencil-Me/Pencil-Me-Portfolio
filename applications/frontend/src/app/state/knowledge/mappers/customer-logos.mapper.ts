import type { CUSTOMER } from '@app/state/knowledge/knowledge.models';

export type CustomerLogo = {
  url: string;
  alt: string;
};

type CustomerLogoRule = {
  match: string;
  logo: CustomerLogo;
};

/** Bekannte Kunden aus der API → statische Logo-Assets im Ticker. */
const CUSTOMER_LOGO_RULES: CustomerLogoRule[] = [
  { match: 'arvato', logo: { url: './assets/logos/arvato.png', alt: 'arvato Bertelsmann' } },
  { match: 'dermalog', logo: { url: './assets/logos/dermalog.png', alt: 'Dermalog' } },
  { match: 'fest', logo: { url: './assets/logos/fest.png', alt: 'FEST GmbH' } },
  { match: 'udg', logo: { url: './assets/logos/udg.png', alt: 'UDG' } },
  { match: 'hdi', logo: { url: './assets/logos/HDI.png', alt: 'HDI' } },
  {
    match: 'objektkultur',
    logo: { url: './assets/logos/objektkultur.png', alt: 'ObjektKultur' },
  },
  { match: 'health ag', logo: { url: './assets/logos/healthag.png', alt: 'Health AG' } },
  {
    match: 'auto1',
    logo: { url: './assets/logos/auto1.png', alt: 'Auto1.com' },
  },
  {
    match: 'pkw1',
    logo: { url: './assets/logos/auto1.png', alt: 'Auto1.com' },
  },
  {
    match: 'carmudi',
    logo: { url: './assets/logos/auto1.png', alt: 'Auto1.com' },
  },
];

export function normalizeCustomerName(name: string): string {
  return name.replace(/&amp;/g, '&').trim();
}

export function resolveCustomerLogo(name: string): CustomerLogo | null {
  const normalized = normalizeCustomerName(name).toLowerCase();
  const rule = CUSTOMER_LOGO_RULES.find((entry) => normalized.includes(entry.match));
  return rule?.logo ?? null;
}

/** API-Kunden mit Logo-Mapping, sortiert nach letztem Projekt (absteigend). */
export function mapCustomersToLogos(customers: CUSTOMER[]): CustomerLogo[] {
  const sortedCustomers = [...customers].sort(
    (a, b) => b.last_used_date.getTime() - a.last_used_date.getTime(),
  );

  const seenUrls = new Set<string>();
  const logos: CustomerLogo[] = [];

  for (const customer of sortedCustomers) {
    const logo = resolveCustomerLogo(customer.name);
    if (logo && !seenUrls.has(logo.url)) {
      seenUrls.add(logo.url);
      logos.push(logo);
    }
  }

  return logos;
}
