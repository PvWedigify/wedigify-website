/**
 * Magento Open Source en Adobe Commerce 2.4 releases.
 * Bron: Adobe Commerce software lifecycle policy (experienceleague.adobe.com).
 * Pas deze lijst aan bij een nieuwe release of gewijzigde supportdata; de versiepagina en
 * het blok op /magento/ lezen allebei hieruit.
 */
export const versiesBijgewerkt = '2026-10-08';

export type MagentoVersie = { versie: string; release: string; regulier: string; extended: string | null; extendedTekst: string | null };

export const magentoVersies: MagentoVersie[] = [
  { versie: '2.4.9', release: '2026-05-12', regulier: '2029-05-31', extended: null, extendedTekst: 'Nog niet bekend' },
  { versie: '2.4.8', release: '2025-04-08', regulier: '2028-05-31', extended: null, extendedTekst: 'Nog niet bekend' },
  { versie: '2.4.7', release: '2024-04-09', regulier: '2027-05-31', extended: '2028-05-31', extendedTekst: null },
  { versie: '2.4.6', release: '2023-03-14', regulier: '2026-08-11', extended: '2027-08-31', extendedTekst: null },
  { versie: '2.4.5', release: '2022-08-09', regulier: '2025-08-11', extended: '2026-08-11', extendedTekst: null },
  { versie: '2.4.4', release: '2022-04-12', regulier: '2025-04-14', extended: null, extendedTekst: 'Verlopen' },
];

export const datumKort = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' });

export type StatusCode = 'ok' | 'bijna' | 'ext' | 'eol';
export function versieStatus(v: MagentoVersie, nu = new Date(versiesBijgewerkt + 'T12:00:00Z')): { code: StatusCode; label: string } {
  const reg = new Date(v.regulier + 'T23:59:59Z');
  const ext = v.extended ? new Date(v.extended + 'T23:59:59Z') : null;
  if (nu <= reg) {
    const maanden = (reg.getUTCFullYear() - nu.getUTCFullYear()) * 12 + reg.getUTCMonth() - nu.getUTCMonth();
    return maanden <= 9 ? { code: 'bijna', label: 'Ondersteund, einde nadert' } : { code: 'ok', label: 'Ondersteund' };
  }
  if (ext && nu <= ext) return { code: 'ext', label: 'Alleen extended support' };
  return { code: 'eol', label: 'Niet meer ondersteund' };
}

export const statusKleur: Record<StatusCode, string> = {
  ok: 'bg-[#e7f7ee] text-[#137a43]',
  bijna: 'bg-[#fff4dc] text-[#8a5a00]',
  ext: 'bg-[#ffe9dc] text-[#9a3d00]',
  eol: 'bg-[#fde7ea] text-[#b4232f]',
};
