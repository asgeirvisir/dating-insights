// Number and date formatting utilities for Dating Insights

/**
 * Format a number with thousands separators.
 * e.g. 4280 -> "4,280"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Format a number as a compact string.
 * e.g. 4280 -> "4.3K", 1200000 -> "1.2M"
 */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Format a number as a percentage string.
 * e.g. 62 -> "62%", 0.62 -> "62%"
 */
export function formatPercent(n: number): string {
  // If the value is between 0 and 1 (exclusive), treat it as a decimal ratio
  const value = n > 0 && n < 1 ? n * 100 : n;
  return `${Math.round(value)}%`;
}

/**
 * Format a ratio as "X out of Y".
 * e.g. (62, 100) -> "62 out of 100"
 */
export function formatRatio(part: number, total: number): string {
  return `${formatNumber(part)} out of ${formatNumber(total)}`;
}

/**
 * Format a yes/no split as a readable string.
 * e.g. (62, 38) -> "62% yes / 38% no"
 */
export function formatYesNo(yes: number, no: number): string {
  return `${yes}% yes / ${no}% no`;
}

/**
 * Format an ISO date string as a human-readable date.
 * e.g. "2026-03-12T09:00:00Z" -> "March 12, 2026"
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string as a short date.
 * e.g. "2026-03-12T09:00:00Z" -> "Mar 12"
 */
export function formatDateShort(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string as a relative time string.
 * e.g. "2 days ago", "3 weeks ago"
 */
export function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return formatDate(isoString);
}

/**
 * Format a sample size for display.
 * e.g. 4280 -> "n = 4,280"
 */
export function formatSampleSize(n: number): string {
  return `n = ${formatNumber(n)}`;
}

/**
 * Pluralize a word based on count.
 * e.g. (1, "match", "matches") -> "1 match"
 * e.g. (5, "match", "matches") -> "5 matches"
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
