import * as React from 'react'
import { SFC } from 'react'
import { theme, ComponentsProvider } from 'docz'
import get from 'lodash/get'

import * as modes from './styles/modes'
import { components } from './components/ui'
import { Global } from './styles/global'
import { config } from './config'
import { ThemeProvider } from './utils/theme'

if (process.env.BIGFISH_VERSION) {
  // 更换 favicon 为 Bigfish logo
  const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = "https://gw-office.alipayobjects.com/basement_prod/c83c53ab-515e-43e2-85d0-4d0da16f11ef.svg";
  const head = document.getElementsByTagName('head')[0]
  head.insertBefore(link, head.firstChild);
}

const Theme: SFC = ({ children }) => (
  <ThemeProvider>
    <Global />
    <ComponentsProvider components={components}>{children}</ComponentsProvider>
  </ThemeProvider>
)

export const enhance = theme(
  config,
  ({ mode, codemirrorTheme, ...config }) => ({
    ...config,
    mode,
    codemirrorTheme: codemirrorTheme || `docz-${mode}`,
    colors: {
      ...get(modes, mode),
      ...config.colors,
    },
  })
)

export default enhance(Theme)
export { components }
