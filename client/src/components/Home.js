import React, { Component } from 'react'

import RecipientList from './RecipientList'
import TransferLog from './TransferLog'
import BalanceBox from './BalanceBox'

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="recipients-list">
          <RecipientList />
        </div>
        <div className="transfer-log">
          <TransferLog />
        </div>
        <div className="balance-box">
          <BalanceBox />
        </div>
      </div>
    )
  }
}
