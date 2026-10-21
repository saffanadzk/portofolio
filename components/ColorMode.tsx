import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleTheme: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: 'light',
  toggleTheme: () => {},
  setColorMode: () => {},
});

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>('light');

  useEffect(() => {
    const saved = localStorage.getItem('app-color-mode') as ColorMode | null;
    const initialMode: ColorMode =
      saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setColorModeState(initialMode);
    applyTheme(initialMode);
  }, []);

  const applyTheme = (mode: ColorMode) => {
    document.body.classList.remove('next-light-theme', 'next-dark-theme');
    document.body.classList.add(`next-${mode}-theme`);
    localStorage.setItem('app-color-mode', mode);
  };

  const toggleTheme = () => {
    const nextMode = colorMode === 'light' ? 'dark' : 'light';
    setColorModeState(nextMode);
    applyTheme(nextMode);
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    applyTheme(mode);
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleTheme, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorSwitcher() {
  return useContext(ColorModeContext);
}

export function ColorModeScript() {
  const scriptSrc = `(function() {
    try {
      var saved = localStorage.getItem('app-color-mode');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var mode = saved || (prefersDark ? 'dark' : 'light');
      document.body.classList.add('next-' + mode + '-theme');
    } catch (e) {}
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: scriptSrc }} />;
}
