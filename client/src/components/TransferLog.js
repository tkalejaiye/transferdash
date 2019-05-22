import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../reacttable.css'
import moment from 'moment'

// Helper method to convert numbers to currency
const formatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2
})

export default class TransferLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      log: [],
      error: ''
    }
  }

  componentDidMount = () => {
    this.getTransferLog()
  }

  // Make api call to get transfer history and populate state with it.
  getTransferLog = () => {
    fetch('/api/list_transfers')
      .then(res => res.json())
      .then(transfers => this.setState({ log: transfers.data, error: '' }))
      .catch(e =>
        this.setState({
          error:
            'Error loading transfer history. Please check your internet connection and refresh the browser page'
        })
      )
  }

  render() {
    return (
      <div className="main-card">
        <div className="card-title">Transfer Log</div>
        {this.state.error ? (
          <p>{this.state.error}</p>
        ) : (
          <ReactTable
            showPagination={false}
            showPageSizeOptions={false}
            defaultPageSize={10}
            data={this.state.log}
            resolveData={data => data.map(row => row)}
            columns={[
              {
                Header: 'Status',
                id: 'status',
                accessor: transfer => transfer.status
              },
              {
                Header: 'Amount',
                id: 'amount',
                accessor: transfer => formatter.format(transfer.amount / 100)
              },
              {
                Header: 'Recipient Name',
                id: 'name',
                accessor: transfer => transfer.recipient.name
              },
              {
                Header: 'Account Number',
                id: 'account_number',
                accessor: transfer => transfer.recipient.details.account_number
              },
              {
                Header: 'Bank Name',
                id: 'bank_name',
                accessor: transfer => transfer.recipient.details.bank_name
              },
              {
                Header: 'Date Added',
                id: 'date',
                accessor: transfer =>
                  moment(transfer.createdAt).format('MMM DD, YYYY')
              }
            ]}
          />
        )}
      </div>
    )
  }
}
