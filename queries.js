//postgres://$USERNAME:$PASSWORD@3eafefae-2443-48d3-be0e-1d9b6edf7462.c7dvrhud08vgdqo60090.databases.appdomain.cloud:32371/ibmclouddb?sslmode=verify-full
const fs = require('fs');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'ibm_cloud_ebeb6e62_b074_4155_8a95_0e7dd00f28ce',
  host: '3eafefae-2443-48d3-be0e-1d9b6edf7462.c7dvrhud08vgdqo60090.databases.appdomain.cloud',
  database: 'ibmclouddb',
  password: 'b459ecb33781e19ed4256dbc0c449a4d56209a91c8cf4c4b35229c74abcdcffc',
  port: 32371,
  sslmode:"verify-full",
  ssl: {
    rejectUnauthorized : false,
    cert: fs
      .readFileSync("./certificate.pem")
      .toString()
  }
});
const getVersion = (request, response) => {
  pool.query('SELECT version()', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
  
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getVersion,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
