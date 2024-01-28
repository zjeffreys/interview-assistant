import React from 'react';
import './Demo.css';
import InterviewQuestions from './InterviewQuestions';
import ParentComponent from './ParentComponent';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import Amplify UI styles

function Demo({ useAuthenticator = false }) { // Default to true if not provided
  const content = (
    <div className="demo-container">
      {/* Your existing components */}
      <ParentComponent />
      <InterviewQuestions />
     
    </div>
  );

  return useAuthenticator ? (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          {/* Display user information and sign out button (Uncomment if needed) */}
          {/* <div className="user-info">
            <p>Welcome, {user.username}</p>
            <button onClick={signOut}>Sign out</button>
          </div> */}
          {content}
        </>
      )}
    </Authenticator>
  ) : content;
}

export default Demo;
