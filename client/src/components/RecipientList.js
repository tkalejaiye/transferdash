import React, { Component } from 'react'
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../reacttable.css'
import StatusIndicator from './StatusIndicator'

export default class RecipientList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: []
    }
  }

  componentDidMount = () => {
    this.getRecipients()
  }

  getRecipients = () => {
    fetch('/api/list_recipients')
      .then(res => res.json())
      .then(recipients => this.setState({ recipients: recipients.data }))
      .catch(e => console.log(e))
  }

  deleteRecipient = recipient_id => {
    fetch(`/api/delete_recipient/${recipient_id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result =>
        result.status
          ? window.location.reload()
          : alert('Delete Transfer Recipient was unsuccessful')
      )
      .catch(e => alert(e))
  }

  render() {
    return (
      <div className="main-card">
        <div className="card-title">Transfer Recipients</div>
        <ReactTable
          className="main-table"
          minRows={5}
          showPagination={false}
          showPageSizeOptions={false}
          defaultPageSize={10}
          data={this.state.recipients}
          resolveData={data => data.map(row => row)}
          columns={[
            {
              Header: 'Status',
              id: 'status',
              accessor: recipient => (
                <StatusIndicator active={recipient.active} />
              ),
              width: 75
            },
            {
              Header: 'Name',
              id: 'name',
              accessor: recipient => recipient.name
            },
            {
              Header: 'Account Number',
              id: 'account_number',
              accessor: recipient => recipient.details.account_number,
              width: 200
            },
            {
              Header: 'Bank',
              id: 'bank',
              accessor: recipient => recipient.details.bank_name,
              width: 200
            },
            {
              Header: 'Date Added',
              id: 'date',
              accessor: recipient =>
                moment(recipient.createdAt).format('MMM DD, YYYY'),
              width: 150
            },
            {
              Header: '',
              id: 'delete',
              accessor: recipient => (
                <button
                  onClick={() => this.deleteRecipient(recipient.recipient_code)}
                >
                  Delete
                </button>
              ),
              width: 75
            }
          ]}
        />
      </div>
    )
  }
}
