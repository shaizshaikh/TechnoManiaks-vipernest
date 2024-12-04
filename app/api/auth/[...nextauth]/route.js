import NextAuth from 'next-auth';
import OktaProvider from 'next-auth/providers/okta';
import axios from 'axios';

// Axios instance with 10-second timeout for custom fetch
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds
});

// Custom fetch function using axios
const customFetch = async (url, options) => {
  try {
    const response = await axiosInstance({
      method: options.method || 'GET',
      url,
      headers: options.headers,
      data: options.body,
    });
    return {
      ok: true,
      status: response.status,
      json: async () => response.data,
    };
  } catch (error) {
    console.error('Custom Fetch Error:', error);
    return {
      ok: false,
      status: error.response ? error.response.status : 500,
      json: async () => ({ error: error.message }),
    };
  }
};

export const authOptions = {
  providers: [
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      issuer: process.env.OKTA_ISSUER,
      fetch: customFetch, // Use the custom fetch function
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Extract accessToken and group claims
    async jwt({ token, account }) {
      if (account?.id_token) {
        try {
          const decodedToken = JSON.parse(Buffer.from(account.id_token.split('.')[1], 'base64').toString());
          token.groups = decodedToken.groups || [];
          token.accessToken = account.access_token; // Store accessToken
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      return token;
    },
    // Add accessToken and group claims to session
    async session({ session, token }) {
      session.groups = token.groups || [];
      session.accessToken = token.accessToken; // Pass accessToken to session
      console.log('Session Data:', session); // Debugging log
      return session;
    },
  },

  events: {
    async error(message) {
      console.error('NextAuth Error:', message);
    },
  },

  debug: true, // Enable detailed logs for debugging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
