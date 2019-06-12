import * as React from 'react'
import { SFC, Fragment } from 'react'
import { PageProps, useConfig, Link } from 'docz'
import Edit from 'react-feather/dist/icons/edit-2'
import styled from 'styled-components'

import { ButtonLink } from './Button'
import { GithubLink, Sidebar, Main } from '../shared'
import { get } from '@utils/theme'
import { mq } from '@styles/responsive'

const Wrapper = styled.div`
  flex: 1;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
  min-width: 0;
  position: relative;
`

export const Container = styled.div`
  box-sizing: border-box;

  ${mq({
    width: ['100%', '100%', '90%'],
    padding: ['20px', '0 24px 24px'],
  })}

  ${get('styles.container')};
`

const EditPage = styled(ButtonLink.withComponent('a'))`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 2px 8px;
  margin: 8px;
  border-radius: ${get('radii')};
  border: 1px solid ${get('colors.border')};
  opacity: 0.7;
  transition: opacity 0.4s;
  font-size: 14px;
  color: ${get('colors.text')};
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
    background: ${get('colors.border')};
  }

  ${mq({
    visibility: ['hidden', 'hidden', 'visible'],
    top: [0, -60, 32],
    right: [0, 0, 40],
  })};
`

const EditIcon = styled(Edit)<{ width: number }>`
  margin-right: 5px;
`

const AnchorWrapper = styled.div`
  ${mq({
    display: ['none', 'none', 'none', 'unset'],
  })}

  position: fixed;
  right: 24px;
  top: 24px;
  > div {
    border-left: 1px solid #f0f0f0;
    padding-left: 16px;
    line-height: 20px;
  }

  > div:nth-child(n + 2) {
    padding-top: 8px;
  }
`

const LinkWrapper = styled(Link)`
  font-size: 12px;
`

export const Page: SFC<PageProps> = ({
  children,
  doc: { link, fullpage, edit = true, headings },
}) => {
  const { repository } = useConfig()

  const content = (
    <Fragment>
      {link && edit && (
        <EditPage href={link} target="_blank">
          <EditIcon width={14} /> Edit page
        </EditPage>
      )}
      {children}
    </Fragment>
  )

  // 右侧锚点只跟踪 h2
  const anchors = headings.filter(v => v.depth === 2)
  const { pathname, hash } = location

  return (
    <Main>
      {repository && <GithubLink repository={repository} />}
      {!fullpage && <Sidebar />}
      <Wrapper>{fullpage ? content : <Container>{content}</Container>}</Wrapper>
      <AnchorWrapper>
        {anchors.map(a => (
          <div key={a.value}>
            <LinkWrapper
              to={`${pathname}#${a.slug}`}
              style={{ color: hash === `#${a.slug}` ? '#1890ff' : 'rgba(0,0,0,.65)' }}
            >
              {a.slug}
            </LinkWrapper>
          </div>
        ))}
      </AnchorWrapper>
    </Main>
  )
}
