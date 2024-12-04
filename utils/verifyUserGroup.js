import jwt from 'jsonwebtoken';

export const verifyUserGroup = (token) => {
  return new Promise((resolve, reject) => {
    try {
      // Decode the token
      const decodedToken = jwt.decode(token);
      
      // Check for the groups claim
      const groups = decodedToken?.groups || [];
      
      // Verify if the user is in the pbs_students group
      if (groups.includes('pbs_students')) {
        resolve(true); // Resolve the promise if the user is in the group
      } else {
        resolve(false); // Resolve false if not in the group
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      reject(false); // Reject the promise if there's an error
    }
  });
};
