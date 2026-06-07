import type { PROJECTTITLE, TECHTITLE } from '@app/shared/domain/portfolio-domain';

/**
 * PHP Public API (/api2) — Roh-JSON-Typen.
 *
 * Feldnamen entsprechen 1:1 der PHP-API (snake_case). Kein camelCase-Mapping
 * auf dieser Schicht; View-Models liegen in den Modul-Ordnern und werden
 * ueber Mapper in state/knowledge/mappers/ erzeugt.
 *
 * Contract: applications/php-rest-api/openapi.yaml (ADR-001).
 * Domain-Enums: applications/shared/domain/portfolio-domain.json.
 */
export type PortfolioApiDate = {
  start_date: Date;
  end_date: Date;
};

export type PortfolioApiTech = {
  uuid: string;
  expertise_level: string;
  name: string;
  type: string;
};

export type PortfolioApiTechStack = {
  type: TECHTITLE;
  name: string;
  expertise_level: number;
  last_usage_date?: Date;
  flag_important: boolean;
  project_count: number;
  project_dates: PortfolioApiDate[];
};

export type PortfolioApiCustomer = {
  name: string;
  location: string;
  last_used_date: Date;
};

export type PortfolioApiProject = {
  uuid: string;
  type: PROJECTTITLE;
  name: string;
  dates: PortfolioApiDate[];
  customers?: PortfolioApiCustomer[];
  location?: string;
  position?: string;
  content?: string;
  content_short?: string | null;
  content_long?: string | null;
  featured_rank?: number | null;
  featured_tag?: string | null;
  featured_problem?: string | null;
  featured_role?: string | null;
  featured_outcome?: string | null;
  tech: PortfolioApiTech[];
};

/** @deprecated Alias — prefer PortfolioApiTechStack */
export type TECHSTACK = PortfolioApiTechStack;

/** @deprecated Alias — prefer PortfolioApiCustomer */
export type CUSTOMER = PortfolioApiCustomer;

/** @deprecated Alias — prefer PortfolioApiDate */
export type DATE = PortfolioApiDate;

/** @deprecated Alias — prefer PortfolioApiTech */
export type TECH = PortfolioApiTech;

/** @deprecated Alias — prefer PortfolioApiProject */
export type PROJECT = PortfolioApiProject;
