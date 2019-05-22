import React, { Component } from 'react'

export default class AddRecipientForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      banks: [],
      name: '',
      email: '',
      bank_code: '',
      account_number: '',
      description: '',
      message: '',
      status: ''
    }
  }

  componentDidMount = () => {
    this.getBankNames() // Get list of bank names to populate dropdown
  }

  // Fetches list of bank names
  getBankNames = () => {
    fetch('https://api.paystack.co/bank', { method: 'GET' })
      .then(res => res.json())
      .then(banks => this.setState({ banks: banks.data }))
  }

  // On submitting form, make a call to the backend with info user has entered.
  // Should return status of operation, true if transfer recipient was successfully created, false if not
  onSubmitForm = e => {
    e.preventDefault()
    this.setState({ status: '', message: '' })
    let { name, email, bank_code, account_number, description } = this.state
    let body = { name, email, bank_code, account_number, description }
    fetch('/api/create_recipient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
    let name = e.target.name
    let value = e.target.value
    this.setState({ [name]: value })
  }

  render() {
    let bankNameOptions = this.state.banks.map(bank => (
      <option key={bank.id} value={bank.code}>
        {bank.name}
      </option>
    ))

    return (
      <div className="container">
        <div className="card-title">Add A New Transfer Recipient</div>
        <div className="form-container">
          <p style={{ color: this.state.status ? 'green' : 'red' }}>
            {this.state.message}
          </p>

          <form>
            <ul>
              <li className="form-container__input">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter recipient name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
              </li>
              <li className="form-container__input">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter recipient email address"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
              </li>
              <li className="form-container__input">
                <label>Bank</label>
                <select
                  name="bank_code"
                  id="bank_code"
                  onChange={this.handleInputChange}
                  value={this.state.bank}
                >
                  <option value="">Choose Bank</option>
                  {bankNameOptions}
                </select>
              </li>
              <li className="form-container__input">
                <label>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  id="account_number"
                  placeholder="Enter recipient account number"
                  onChange={this.handleInputChange}
                  value={this.state.account_number}
                />
              </li>
              <li className="form-container__input">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Optional"
                  onChange={this.handleInputChange}
                  value={this.state.description}
                />
              </li>
            </ul>

            <button
              className="form-container__submit"
              onClick={this.onSubmitForm}
            >
              Add Recipient
            </button>
          </form>
        </div>
      </div>
    )
  }
}
