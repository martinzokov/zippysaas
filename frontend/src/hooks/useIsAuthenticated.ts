import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';

export function useIsAuthenticated() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    Auth.currentSession()
    .then((result) => {
      const token = result.getIdToken().getJwtToken();
      const validToken = token !== undefined && token !== null && token.length > 0
      setIsAuthenticated(validToken);
    })
    .catch((err) => {
      console.log(err);
    });
  });

  return isAuthenticated;
}