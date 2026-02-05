import { describe, it, expect, vi } from 'vitest';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({ render: vi.fn() }))
}));

vi.mock('../App', () => ({ default: () => null }));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    QueryClientProvider: ({ children }) => children,
    QueryClient: actual.QueryClient
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children
  };
});

describe('main entry', () => {
  it('creates root and renders app', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const { createRoot } = await import('react-dom/client');
    await import('../main.jsx');

    expect(createRoot).toHaveBeenCalledWith(root);
  });
});
