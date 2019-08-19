import * as React from 'react'
import { SFC, useRef, useEffect } from 'react'
import { useConfig } from 'docz'
import styled from 'styled-components'
import Hash from 'react-feather/dist/icons/hash'

import { get } from '@utils/theme'

import scrollama from 'scrollama'
import 'intersection-observer'

const Icon = styled(Hash)`
  position: absolute;
  display: inline-block;
  top: 9px;
  left: -23px;
  opacity: 0;
  transition: opacity 0.2s;
  color: ${get('colors.primary')};
`

const Heading = styled.h2`
  position: relative;

  &:hover .heading--Icon {
    opacity: 1;
  }

  ${get('styles.h2')};
`

export const H2: SFC<React.HTMLAttributes<any>> = ({ children, ...props }) => {
  const pathname = typeof window !== 'undefined' ? location.pathname : '/'
  const { linkComponent: Link } = useConfig()
  if (!Link) return null

  const isMounted = useRef(false)

  useEffect(() => {
    // 空标题直接 return
    if (!props.id) {
      return
    }

    // instantiate the scrollama
    const scroller = scrollama()

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: '#' + props.id,
        offset: 0.05,
        order: false,
      })
      .onStepEnter(() => {
        if (isMounted.current && props.id !== localStorage.getItem('currentSlug')) {
          localStorage.setItem('currentSlug', props.id || '')
          window.dispatchEvent(new Event('storage'))
        } else {
          isMounted.current = true
        }
      })

    // setup resize event
    window.addEventListener('resize', scroller.resize)

    return () => {
      window.removeEventListener('resize', scroller.resize)
    }
  }, [])

  return (
    <Heading {...props}>
      <Link aria-hidden to={`${pathname}#${props.id}`}>
        <Icon className="heading--Icon" height={20} />
      </Link>
      {children}
    </Heading>
  )
}
