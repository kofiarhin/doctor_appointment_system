import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('frontend app shell', () => {
  it('renders root mount element', () => {
    const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html.includes('<div id="root"></div>')).toBe(true);
  });
});
