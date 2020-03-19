'use strict';

const { BASE_URL } = require('./constants');

const fetchWorkspaces = async (method, _path, token, { fetch }) => {
  if (method !== 'GET') {
    return {
      status: 405,
      body: { message: 'Method not allowed.' }
    };
  }
  const response = await fetch(`${BASE_URL}/workspaces`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  });

  if (response.status !== 200) {
    throw new Error(`Non-200 (${response.status}) response for GET Request`);
  }

  return await response.json();
};

module.exports = fetchWorkspaces;
