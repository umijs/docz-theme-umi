import React from 'react'
import { MenuItem, Link, useDocs, Entry } from 'docz'
import styled from 'styled-components'

const MenuContainer = styled.div`
  width: 100%;
  padding: 20px 0 24px 24px;
  line-height: 22px;
`

const MenuTitle = styled.div`
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 14px;
`

const Menu = styled.div`
  margin-top: 24px;
  width: 100%;
`

const ItemTitle = styled.div`
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 24px;
  font-size: 14px;
`

const Item = styled.div<ItemProps>`
  cursor: pointer;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 24px;
  transition: color 0.3s;

  :hover {
    > a {
      color: #1890ff;
    }
  }
  > a {
    display: block;
    font-size: ${props => (props.size === 'large' ? '14px' : '12px')};
    line-height: ${props => (props.size === 'large' ? '22px' : '20px')};
    color: ${p => (p.selected ? '#1890ff' : 'rgba(0, 0, 0, 0.65)')};
  }
`

interface CustomMenuProps {
  query: string
}

interface ArrangedDoc {
  name: string
  menu: Entry[]
  menuOrder: number
}

interface ItemProps {
  selected: boolean
  size?: 'default' | 'large'
}

const CustomMenu: React.SFC<CustomMenuProps> = ({ query }) => {
  const { pathname } = location
  const docs = useDocs()

  // 按 menu 组织文档顺序
  const docsArrangedInMenu =
    docs &&
    docs
      .filter(v => v.name.indexOf(query) > -1)
      .reduce(
        (list, doc) => {
          if (doc.menu) {
            // 如果配置了 menu，将同一 menu 下的所有 docs 放到一个 SubMenu 内展示
            const existedMenu = list.find(v => v.name === doc.menu)
            if (existedMenu) {
              const sortedDocs = existedMenu.menu
                .concat([doc])
                .sort((a: Entry, b: Entry) => a.order - b.order)
              existedMenu.menu = sortedDocs
            } else {
              list.push({
                name: doc.menu,
                menu: [doc],
                menuOrder: doc.menuOrder || doc.order,
              } as ArrangedDoc)
            }
          } else {
            // 如果没有配置 menu 属性，直接当作 Menu.Item 处理
            list.push({
              name: '',
              menu: [doc],
              menuOrder: doc.menuOrder || doc.order,
            })
          }
          return list
        },
        [] as ArrangedDoc[]
      )
      .sort((a, b) => a.menuOrder - b.menuOrder)

  return (
    <MenuContainer>
      <MenuTitle>Components</MenuTitle>
      <Menu>
        {docsArrangedInMenu &&
          docsArrangedInMenu.map((item: ArrangedDoc) =>
            item.name ? (
              <React.Fragment key={item.name}>
                <ItemTitle>{item.name}</ItemTitle>
                {item.menu &&
                  item.menu.map(v => (
                    <Item selected={v.route === pathname} key={v.route}>
                      <Link to={v.route}>
                        <span>{v.name}</span>
                      </Link>
                    </Item>
                  ))}
              </React.Fragment>
            ) : (
              <React.Fragment key={item.menu[0].route}>
                <Item selected={item.menu[0].route === pathname} size="large">
                  <Link to={item.menu[0].route}>
                    <span>{item.menu[0].name}</span>
                  </Link>
                </Item>
              </React.Fragment>
            )
          )}
      </Menu>
    </MenuContainer>
  )
}

export default CustomMenu
