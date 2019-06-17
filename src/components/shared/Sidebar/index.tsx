import * as React from 'react'
import { Fragment, SFC, useState, useEffect } from 'react'
import { useMenus, useWindowSize, usePrevious } from 'docz'
import styled from 'styled-components'

import { get } from '@utils/theme'
import { mq, breakpoints } from '@styles/responsive'

import { Logo } from '../Logo'
import CustomSearch from '../Search/CustomSearch'
import { Hamburger } from './Hamburger'
import CustomMenu from './CustomMenu'

interface WrapperProps {
  opened: boolean
  theme?: any
}

const sidebarBg = get('colors.sidebarBg')
const sidebarText = get('colors.sidebarText')

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  width: 316px;
  min-width: 316px;
  min-height: 100vh;
  background: ${sidebarBg};
  transition: transform 0.2s, background 0.3s;
  z-index: 1000;

  ${mq({
    position: ['absolute', 'absolute', 'absolute', 'relative'],
  })};

  dl {
    padding: 0;
    margin: 0 16px;
  }

  dl a {
    font-weight: 400;
  }

  @media screen and (max-width: ${breakpoints.desktop - 1}px) {
    transform: translateX(${p => (p.opened ? '-100%' : '0')});
    position: ${p => (p.opened ? 'auto' : 'fixed')};
  }

  ${get('styles.sidebar')};
`

const Content = styled.div`
  position: fixed;
  top: 24px;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 316px;
  min-width: 316px;
  height: 100%;
  max-height: 100vh;
`

const Empty = styled.div`
  flex: 1;
  opacity: 0.7;
  padding: 24px 24px;
  color: ${sidebarText};
`

const BuiltWith = styled.div`
  width: 100%;
  bottom: 0px;
  padding: 24px;
  margin-bottom: 24px;
`

export const Sidebar: SFC = () => {
  const [hidden, setHidden] = useState(true)
  const [query, setQuery] = useState('')
  const menus = useMenus({ query })
  const windowSize = useWindowSize()
  const isDesktop = windowSize.outerWidth >= breakpoints.desktop
  const prevIsDesktop = usePrevious(isDesktop)

  const browserLanguage: string = window.navigator.language
  let emptyPlaceholder = 'No documents found.'
  if (browserLanguage === 'zh-CN') {
    emptyPlaceholder = '未找到相应组件'
  }

  useEffect(() => {
    if (!hidden && !prevIsDesktop && isDesktop) {
      setHidden(true)
      document.documentElement!.classList.remove('with-overlay')
    }
  })

  const addOverlayClass = (isHidden: boolean) => {
    const method = !isHidden ? 'add' : 'remove'

    if (window && typeof window !== 'undefined' && !isDesktop) {
      document.documentElement!.classList[method]('with-overlay')
    }
  }

  const handleSidebarToggle = () => {
    setHidden(s => !s)
    addOverlayClass(!hidden)
  }

  return (
    <Fragment>
      <Wrapper opened={hidden}>
        <Content>
          <Hamburger opened={!hidden} onClick={handleSidebarToggle} />
          {process.env.BIGFISH_VERSION ? null : <Logo showBg={!hidden} />}
          <CustomSearch onSearch={setQuery} />

          {menus && menus.length === 0 ? (
            <Empty>{emptyPlaceholder}</Empty>
          ) : (
            <CustomMenu query={query} />
          )}
          {process.env.BIGFISH_VERSION ? null : (
            <BuiltWith>
              <span>Build with </span>
              <a href="https://github.com/umijs/father">father</a>
              <span> and </span>
              <a href="https://www.docz.site">docz</a>
            </BuiltWith>
          )}
        </Content>
      </Wrapper>
    </Fragment>
  )
}
