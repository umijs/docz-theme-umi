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

  display: flex;
  flex-direction: row;
`

export const Container = styled.div<{ fullpage?: boolean }>`
  box-sizing: border-box;

  ${props => mq({
    width: props.fullpage ? ['100%', '100%', '100%'] : ['100%', 'calc(100% - 224px)', 'calc(100% - 224px)'],
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

interface AnchorProps {
  hash: string
  slug: string
}

const AnchorWrapper = styled.div`
  position: relative;
  padding-top: 24px;
  min-width: 224px;

  > div {
    position: fixed;
  }
`

const Anchor = styled.div<AnchorProps>`
  border-left: 1px solid #f0f0f0;
  border-color: ${props => (props.hash.slice(1) === props.slug ? get('colors.blue') : '#f0f0f0')};
  padding-left: 16px;
  line-height: 20px;
  min-width: 224px;
  padding-top: 4px;
  padding-bottom: 4px;
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
      <Wrapper>
        {fullpage ? (
          <Container fullpage>{content}</Container>
        ) : (
          <>
            <Container>{content}</Container>
            <AnchorWrapper>
              <div>
                {anchors.map(a => (
                  <Anchor key={a.slug} hash={hash} slug={a.slug}>
                    <LinkWrapper
                      to={`${pathname}#${a.slug}`}
                      style={{ color: hash === `#${a.slug}` ? '#1890ff' : 'rgba(0,0,0,.65)' }}
                    >
                      {a.value}
                    </LinkWrapper>
                  </Anchor>
                ))}
              </div>
            </AnchorWrapper>
          </>
        )}
      </Wrapper>
    </Main>
  )
}
