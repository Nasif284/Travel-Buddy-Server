import axios from 'axios';

interface GoogleUser {
  email: string;
  name?: string;
  picture?: string;
}

export async function verifyGoogleToken(
  accessToken: string,
): Promise<GoogleUser> {
  const response = await axios.get<GoogleUser>(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
}
