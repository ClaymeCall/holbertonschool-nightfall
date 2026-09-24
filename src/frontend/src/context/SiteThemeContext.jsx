import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SiteThemeContext = createContext(null);

// Mirrors the theme onto <html data-theme="..."> so every themed color
// variable (see src/index.css) cascades through the whole page, not just
// the element that requested it.
function SiteThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const value = useMemo(() => ({ setSiteTheme: setTheme }), []);

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>;
}

export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error('useSiteTheme must be used inside <SiteThemeProvider>');
  }
  return context.setSiteTheme;
}

export default SiteThemeProvider;
