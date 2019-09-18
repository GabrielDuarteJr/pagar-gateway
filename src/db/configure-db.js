const Client = require('./')

const createUserTable = `
  CREATE TABLE IF NOT EXISTS public.user
  (
      name VARCHAR(32),
      clientid uuid NOT NULL,
      clientkey VARCHAR(100) NOT NULL,
      email VARCHAR(32),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      id SERIAL,
      PRIMARY KEY (id)
  )
  WITH (
      OIDS = FALSE
  );
`

const createTransactionTable = `
  CREATE TABLE IF NOT EXISTS public.transaction
  (
      value VARCHAR(20),
      description VARCHAR(32),
      paymentMethod VARCHAR(20),
      cardNumber VARCHAR(20),
      bearerName VARCHAR(32),
      cardExpiration VARCHAR(10),
      cvv VARCHAR(4),
      userId SERIAL REFERENCES public.user(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      id SERIAL,
      PRIMARY KEY (id)
  );
`

const createPayableTable = `
  CREATE TABLE IF NOT EXISTS public.payable
  (
      payable VARCHAR(20),
      paymentDate VARCHAR(32),
      status VARCHAR(20),
      userId SERIAL REFERENCES public.user(id),
      transactionId SERIAL REFERENCES public.transaction(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      id SERIAL,
      PRIMARY KEY (id)
  );
`

const createDatabase = async () => {
  const client = await Client.connect()
  try {
    await client.query('BEGIN')
    await client.query(createUserTable)
    await client.query(createTransactionTable)
    await client.query(createPayableTable)
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw new Error(err.message)
  }
  client.release()
}

module.exports = createDatabase
