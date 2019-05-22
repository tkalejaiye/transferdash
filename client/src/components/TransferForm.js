import React, { Component } from 'react'

export default class TransferForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stored_recipients: [],
      amount: '',
      recipient: '',
      reason: '',
      message: '',
      status: ''
    }
  }

  componentDidMount = () => {
    fetch('/api/list_recipients')
      .then(res => res.json())
      .then(recipients => this.setState({ stored_recipients: recipients.data })) // Get list of available transfer recipients to populate dropdown
  }

  // On form submission, make a call to backend with data entered in form. Should return status of pending if transaction completes as OTP is disabled
  onSubmitTransfer = e => {
    e.preventDefault()
    this.setState({ status: '', message: '' })
    let { amount, recipient, reason } = this.state
    amount *= 100 //Convert Naira amount to kobo
    let body = { amount, recipient, reason }

    fetch('/api/initiate_transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(response =>
        this.setState({ status: response.status, message: response.message })
      )
      .catch(e =>
        this.setState({
          message:
            'Network request failed. Please check your internet connection and refresh the browser page'
        })
      )
  }

  handleInputChange = e => {
    let { name } = e.target
    let { value } = e.target

    this.setState({
      [name]: value
    })
  }

  render() {
    let recipients = this.state.stored_recipients.map(recipient => (
      <option key={recipient.id} value={recipient.recipient_code}>
        {recipient.name} - {recipient.details.account_number}
      </option>
    ))
    return (
      <div className="container">
        <div className="card-title">Make a Transfer</div>
        <div className="form-container">
          <p style={{ color: this.state.status ? 'green' : 'red' }}>
            {this.state.message}
          </p>

          <form>
            <ul>
              <li className="form-container__input">
                <label>Enter Transfer Amount</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={this.state.amount}
                  onChange={this.handleInputChange}
                  placeholder="0"
                />
              </li>
              <li className="form-container__input">
                <label>Select Recipient</label>
                <select
                  name="recipient"
                  id="recipient"
                  value={this.state.recipient}
                  onChange={this.handleInputChange}
                >
                  <option value="" />
                  {recipients}
                </select>
              </li>
              <li className="form-container__input">
                <label>Enter Transfer Notes</label>
                <input
                  type="text"
                  name="reason"
                  id="reason"
                  placeholder="Optional"
                  value={this.state.reason}
                  onChange={this.handleInputChange}
                />
              </li>
            </ul>
            <button
              className="form-container__submit"
              onClick={this.onSubmitTransfer}
            >
              Make Transfer
            </button>
          </form>
        </div>
      </div>
    )
  }
}
