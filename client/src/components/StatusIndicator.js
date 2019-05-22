import React from 'react'

export default function StatusIndicator(props) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        backgroundColor: props.active === true ? '#3BB65E' : 'red',
        borderRadius: '50%'
      }}
    />
  )
}
