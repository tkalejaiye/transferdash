import React, { Component } from 'react'

export default class BalanceBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      balance: {}
    }
  }

  componentDidMount = () => {
    this.getBalance()
  }

  getBalance = () => {
    fetch('/api/check_balance')
      .then(res => res.json())
      .then(balance => this.setState({ balance: balance.data[0] }))
      .catch(e => console.log(e))
  }
  render() {
    return (
      <div className="main-card">
        <div className="card-title">Account Balance</div>
        <h1>
          {this.state.balance.currency} {this.state.balance.balance}
        </h1>
      </div>
    )
  }
}
