const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv').config()
const fetch = require('node-fetch')
const shortid = require('short-id')
const path = require('path')
const port = process.env.PORT || 8000

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')))

//production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')))
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join((__dirname = 'client/build/index.html')))
  })
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'))
})

// App Configuration
app.use(bodyparser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Fake Cakes')
})

// Create a transfer recipient
app.post('/api/create_recipient', (req, res) => {
  const body = { ...req.body, type: 'nuban', currency: 'NGN' }
  console.log(req.body)
  fetch('https://api.paystack.co/transferrecipient', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    }
  })
    .then(res => res.json())
    .then(newRecipient => res.send(newRecipient))
    .catch(e => res.send(e))
})

// List transfer recipients
app.get('/api/list_recipients', (req, res) => {
  fetch('https://api.paystack.co/transferrecipient', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    }
  })
    .then(res => res.json())
    .then(recipients => res.send(recipients))
    .catch(e => res.send(e))
})

// Update transfer recipient
app.put('/api/update_recipient/:id', (req, res) => {
  const recipient_id = req.params.id
  const body = { ...req.body }
  fetch(`https://api.paystack.co/transferrecipient/${recipient_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(result => res.send(result))
    .catch(e => res.send(e))
})

// Delete transfer recipient
app.delete('/api/delete_recipient/:id', (req, res) => {
  const recipient_id = req.params.id
  fetch(`https://api.paystack.co/transferrecipient/${recipient_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    }
  })
    .then(res => res.json())
    .then(result => res.send(result))
    .catch(e => res.send(e))
})

// Initiate a transfer
app.post('/api/initiate_transfer', (req, res) => {
  const reference = shortid.generate()
  const body = { ...req.body, source: 'balance', currency: 'NGN', reference }

  fetch('https://api.paystack.co/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(result => res.send(result))
    .catch(e => res.send(e))
})

// Finalize transfer
app.post('/api/finalize_transfer', (req, res) => {
  const body = { ...req.body }

  fetch('https://api.paystack.co/transfer/finalize_transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(result => res.send(result))
    .catch(e => res.send(e))
})

// Bulk transfer
app.post('/api/bulk_transfer', (req, res) => {
  const body = req.body.recipients

  fetch('https://api.paystack.co/transfer/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(result => res.send(result))
    .catch(e => res.send(e))
})

// List transfers
app.get('/api/list_transfers', (req, res) => {
  fetch('https://api.paystack.co/transfer', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    }
  })
    .then(res => res.json())
    .then(transfers => res.send(transfers))
    .catch(e => res.send(e))
})

// Check balance
app.get('/api/check_balance', (req, res) => {
  fetch('https://api.paystack.co/balance', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.bearer}`
    }
  })
    .then(res => res.json())
    .then(balance => res.send(balance))
    .catch(e => res.send(e))
})

// Start server
app.listen(port, () => console.log('Server running on port 8000'))
