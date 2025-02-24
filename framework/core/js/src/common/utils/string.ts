/**
 * Truncate a string to the given length, appending ellipses if necessary.
 */
export function truncate(string: string, length: number, start: number = 0): string {
  return (start > 0 ? '...' : '') + string.substring(start, start + length) + (string.length > start + length ? '...' : '');
}

/**
 * Create a slug out of the given string depending on the selected mode.
 * Invalid characters are converted to hyphens.
 *
 * NOTE: This method does not use the comparably sophisticated transliteration
 * mechanism that is employed in the backend. Therefore, it should only be used
 * to *suggest* slugs that can be overridden by the user.
 */
export function slug(string: string, mode: SluggingMode = SluggingMode.ALPHANUMERIC): string {
  switch (mode) {
    case SluggingMode.UTF8:
      return (
        string
          .toLowerCase()
          // Match non-word characters (take UTF8 into consideration) and replace with a dash.
          .replace(/[^\p{L}\p{N}\p{M}]/giu, '-')
          .replace(/-+/g, '-')
          .replace(/-$|^-/g, '')
      );

    case SluggingMode.ALPHANUMERIC:
    default:
      return string
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/-$|^-/g, '');
  }
}

enum SluggingMode {
  ALPHANUMERIC = 'alphanum',
  UTF8 = 'utf8',
}

/**
 * Strip HTML tags and quotes out of the given string, replacing them with
 * meaningful punctuation.
 */
export function getPlainContent(string: string): string {
  const html = string.replace(/(<\/p>|<br>)/g, '$1 &nbsp;').replace(/<img\b[^>]*>/gi, ' ');

  const element = new DOMParser().parseFromString(html, 'text/html').documentElement;

  getPlainContent.removeSelectors.forEach((selector) => {
    const el = element.querySelectorAll(selector);
    el.forEach((e) => {
      e.remove();
    });
  });

  return element.innerText.replace(/\s+/g, ' ').trim();
}

/**
 * An array of DOM selectors to remove when getting plain content.
 *
 * @type {Array}
 */
getPlainContent.removeSelectors = ['blockquote', 'script'];

/**
 * Make a string's first character uppercase.
 */
export function ucfirst(string: string): string {
  return string.substr(0, 1).toUpperCase() + string.substr(1);
}
