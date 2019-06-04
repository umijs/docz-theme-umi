import React, { useState } from 'react'
import styled from 'styled-components'
import { Input, Icon } from 'antd'

interface SearchProps {
  onSearch: (v: string) => void
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding-left: 36px;
`

const InputWrapper = styled(Input)`
  border: none !important;
  box-shadow: none !important;
`

const SearchIcon = styled(Icon)`
  position: absolute;
  left: 24px;
  top: 10px;
  cursor: pointer;
`

const CustomSearch: React.SFC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const onPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onSearch((e.target as HTMLInputElement).value)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  
  const onClickSearch = () => {
    onSearch(query || '')
  }

  return (
    <Wrapper>
      <InputWrapper placeholder="在组件中搜索" onPressEnter={onPressEnter} onChange={onChange} value={query}/>
      <SearchIcon type="search" onClick={onClickSearch} />
    </Wrapper>
  )
}

export default CustomSearch
