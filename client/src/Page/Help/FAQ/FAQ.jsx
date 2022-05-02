import React from 'react'
import { data } from './data'
import styled from 'styled-components'
import {IconContext} from 'react-icons'
import {FiPlus, FiMinus} from 'react-icons/fi'


const FAQ = () => {
  return (
    <div>
      {data.map((item) => {
          <h1>{item.question}</h1>
      })}
    </div>
  )
}

export default FAQ
