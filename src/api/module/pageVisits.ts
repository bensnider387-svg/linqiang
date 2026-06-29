import Http from '../http';

export interface PageVisit {
  id: number;
  trader_uuid?: string;
  trader_name?: string;
  ip_address?: string;
  country?: string;
  country_zh?: string;
  city?: string;
  city_zh?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  path?: string;
  visit_host?: string;
  visit_url?: string;
  visitor_label?: string;
  user_id?: number;
  user_agent?: string;
  visit_count?: number;
  first_visited_at?: string;
  visited_at?: string;
}

export interface VisitMapCity {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  count: number;
  lastVisitedAt?: string;
}

export interface VisitMapSummary {
  totalVisits: number;
  uniqueIps: number;
  totalVisitCount?: number;
  uniqueCountries: number;
  cities: VisitMapCity[];
  recent: PageVisit[];
  filteredBotCount?: number;
  statsStartAt?: string | null;
  isSuperAdmin?: boolean;
  traderUuid?: string | null;
}

export const getVisitMapSummary = (days = 7) =>
  Http.get('/page-visits/summary', { days });

export const getPageVisits = (params: {
  offset?: number;
  limit?: number;
  days?: number;
  search?: string;
}) => Http.get('/page-visits', params);
