import React, { Component } from 'react'
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../reacttable.css'
import StatusIndicator from './StatusIndicator'
import Modal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

export default class RecipientList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: [],
      modalIsOpen: false,
      activeRecipient: null
    }
  }

  componentDidMount = () => {
    this.getRecipients()
  }

  openModal = recipient => {
    this.setState({
      modalIsOpen: true,
      activeRecipient: recipient
    })
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
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

  editRecipient = recipient_id => {
    fetch(`/api/update_recipient/${recipient_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.activeRecipient.name,
        email: this.state.activeRecipient.email
      })
    })
      .then(res => res.json())
      .then(result =>
        result.status
          ? window.location.reload()
          : alert('Could not successfully update recipient :(')
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
              id: 'edit',
              accessor: recipient => (
                <button onClick={() => this.openModal(recipient)}>Edit</button>
              )
            },
            {
              Header: '',
              id: 'delete',
              accessor: recipient => (
                <button onClick={() => this.deleteRecipient(recipient.id)}>
                  Delete
                </button>
              ),
              width: 75
            }
          ]}
        />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <form>
            <ul>
              <li className="form-container__input">
                <label>Name</label>
                <input
                  type="text"
                  value={
                    this.state.activeRecipient
                      ? this.state.activeRecipient.name
                      : ''
                  }
                  onChange={event =>
                    this.setState({
                      activeRecipient: {
                        ...this.state.activeRecipient,
                        name: event.target.value
                      }
                    })
                  }
                />
              </li>
              <li className="form-container__input">
                <label>Email Address</label>
                <input
                  type="email"
                  value={
                    this.state.activeRecipient
                      ? this.state.activeRecipient.email
                      : ''
                  }
                  onChange={event =>
                    this.setState({
                      activeRecipient: {
                        ...this.state.activeRecipient,
                        email: event.target.value
                      }
                    })
                  }
                />
              </li>
            </ul>
          </form>
          <button className="form-container__cancel" onClick={this.closeModal}>
            Cancel
          </button>
          <button
            className="form-container__submit"
            onClick={() => this.editRecipient(this.state.activeRecipient.id)}
          >
            Update
          </button>
        </Modal>
      </div>
    )
  }
}
