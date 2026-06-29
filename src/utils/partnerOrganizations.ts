export const DEFAULT_PARTNER_SECTION_TITLE = 'Partner Institutions';

const LEGACY_PARTNER_SECTION_TITLES = new Set(['合作机构', '合作伙伴']);

export function normalizePartnerSectionTitle(title?: string | null): string {
  const trimmed = String(title || '').trim();
  if (!trimmed || LEGACY_PARTNER_SECTION_TITLES.has(trimmed)) {
    return DEFAULT_PARTNER_SECTION_TITLE;
  }
  return trimmed;
}
