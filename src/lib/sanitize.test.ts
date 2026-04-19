import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeContactField } from './sanitize';

describe('escapeHtml', () => {
  it('should escape < and > characters', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('should escape & characters', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('should escape double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s');
  });

  it('should escape img onerror XSS payload', () => {
    expect(escapeHtml('<img src=x onerror=alert(1)>')).toBe(
      '&lt;img src=x onerror=alert(1)&gt;'
    );
  });

  it('should handle nested HTML tags', () => {
    expect(escapeHtml('<div><a href="javascript:alert(1)">click</a></div>')).toBe(
      '&lt;div&gt;&lt;a href=&quot;javascript:alert(1)&quot;&gt;click&lt;/a&gt;&lt;/div&gt;'
    );
  });

  it('should return plain text unchanged', () => {
    expect(escapeHtml('Hello world')).toBe('Hello world');
  });

  it('should handle empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle all special characters together', () => {
    expect(escapeHtml('<b>"Tom & Jerry\'s"</b>')).toBe(
      '&lt;b&gt;&quot;Tom &amp; Jerry&#x27;s&quot;&lt;/b&gt;'
    );
  });
});

describe('sanitizeContactField', () => {
  it('should trim whitespace and escape HTML', () => {
    expect(sanitizeContactField('  <script>alert(1)</script>  ')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('should trim whitespace from clean input', () => {
    expect(sanitizeContactField('  Hello  ')).toBe('Hello');
  });

  it('should handle input that only needs trimming', () => {
    expect(sanitizeContactField('  normal text  ')).toBe('normal text');
  });

  it('should handle input that only needs escaping', () => {
    expect(sanitizeContactField('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;/b&gt;');
  });
});
