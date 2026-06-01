let token = null;

export async function getValidToken(
  request
) {

  if (token) {

    console.log(
      'Using existing token'
    );

    console.log(
      'Cached Token:',
      token
    );

    return token;

  }

  console.log(
    'Generating new token...'
  );

  const response =
    await request.post(

      process.env.AUTH_URL,

      {

        headers: {

          'Content-Type':
            'application/x-www-form-urlencoded'

        },

        form: {

          grant_type:
            'client_credentials',

          client_id:
            process.env.CLIENT_ID,

          client_secret:
            process.env.CLIENT_SECRET

        }

      }

    );

  if (!response.ok()) {

    throw new Error(

      `Token generation failed:
${response.status()}`

    );

  }

  const body =
    await response.json();

  console.log(
    'Token Response:',
    body
  );

  token =
    body.access_token;

  console.log(
    'Extracted Token:',
    token
  );

  return token;

}

