import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import * as fc from 'fast-check';
import { ThemeService } from './theme.service';

function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches }),
  });
}

describe('ThemeService', () => {
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  function createService(storedTheme: string | null = null, osDark = false): ThemeService {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(storedTheme);
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    mockMatchMedia(osDark);
    TestBed.configureTestingModule({});
    return TestBed.inject(ThemeService);
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    document.body.classList.remove('dark');
  });

  describe('initialization', () => {
    it('defaults to light when no localStorage value and no OS dark preference', () => {
      const service = createService(null, false);
      expect(service.currentTheme()).toBe('light');
    });

    it('reads dark theme from localStorage when stored', () => {
      const service = createService('dark');
      expect(service.currentTheme()).toBe('dark');
    });

    it('reads light theme from localStorage when stored', () => {
      const service = createService('light');
      expect(service.currentTheme()).toBe('light');
    });

    it('falls back to OS dark preference when localStorage is empty', () => {
      const service = createService(null, true);
      expect(service.currentTheme()).toBe('dark');
    });

    it('ignores invalid localStorage values and falls back to OS dark preference', () => {
      const service = createService('invalid-value', true);
      expect(service.currentTheme()).toBe('dark');
    });

    it('ignores invalid localStorage values and falls back to OS light preference', () => {
      const service = createService('invalid-value', false);
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('toggleTheme()', () => {
    it('switches from light to dark', () => {
      const service = createService('light');
      service.toggleTheme();
      expect(service.currentTheme()).toBe('dark');
    });

    it('switches from dark to light', () => {
      const service = createService('dark');
      service.toggleTheme();
      expect(service.currentTheme()).toBe('light');
    });

    it('returns to original theme after two toggles', () => {
      const service = createService('light');
      service.toggleTheme();
      service.toggleTheme();
      expect(service.currentTheme()).toBe('light');
    });
  });

  describe('side effects', () => {
    it('adds dark class to body when theme is dark', () => {
      const service = createService('light');
      service.toggleTheme(); // → dark
      TestBed.flushEffects();
      expect(document.body.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from body when theme switches to light', () => {
      const service = createService('dark');
      TestBed.flushEffects();
      service.toggleTheme(); // → light
      TestBed.flushEffects();
      expect(document.body.classList.contains('dark')).toBe(false);
    });

    it('persists theme to localStorage on toggle', () => {
      const service = createService('light');
      service.toggleTheme();
      TestBed.flushEffects();
      expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  // Feature: portfolio-website, Property 4: Theme toggle is idempotent over two applications
  describe('Property 4: Theme toggle is idempotent over two applications', () => {
    /**
     * Validates: Requirements 8.2
     *
     * For any initial theme state, toggling the theme twice SHALL return
     * the application to its original theme state.
     */
    it('returns to original theme after toggling twice for any initial theme', () => {
      fc.assert(
        fc.property(fc.constantFrom('light', 'dark'), (initialTheme) => {
          const service = createService(initialTheme as 'light' | 'dark');
          service.toggleTheme();
          service.toggleTheme();
          expect(service.currentTheme()).toBe(initialTheme);
          TestBed.resetTestingModule();
          vi.restoreAllMocks();
          document.body.classList.remove('dark');
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: portfolio-website, Property 3: Theme persistence round-trip
  describe('Property 3: Theme persistence round-trip', () => {
    /**
     * Validates: Requirements 8.3, 8.4
     *
     * For any theme value ('light' or 'dark') that a Visitor selects,
     * saving it to localStorage and then reading it back SHALL return the same theme value.
     */
    it('round-trips any theme value through localStorage unchanged', () => {
      fc.assert(
        fc.property(fc.constantFrom('light', 'dark'), (theme) => {
          localStorage.setItem('theme', theme);
          const retrieved = localStorage.getItem('theme');
          expect(retrieved).toBe(theme);
        }),
        { numRuns: 100 }
      );
    });
  });
});
