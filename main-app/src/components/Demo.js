import React from 'react';
import './Demo.css';
import InterviewQuestions from './InterviewQuestions';
import ParentComponent from './ParentComponent';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import Amplify UI styles

function Demo() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="demo-container">
          {/* Display user information and sign out button */}
          {/* <div className="user-info">
            <p>Welcome, {user.username}</p>
            <button onClick={signOut}>Sign out</button>
          </div> */}

          {/* Your existing components */}
          <InterviewQuestions />
          <ParentComponent />
        </div>
      )}
    </Authenticator>
  );
}


export default Demo;
