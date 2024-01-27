import React, { useState } from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/adventure_time.css';
import './JsonDisplay.css'; // Ensure this path is correct

const JsonDisplay = ({ filename, text }) => {
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append('filename', filename);
      formData.append('transcribed_text', text);

      const response = await fetch('https://nv2lio7ckbucjkeujfc4bn7ufm0zoptl.lambda-url.us-west-2.on.aws/summarize_text_to_json', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setJsonData(data);
      } else {
        console.error('API call failed:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="json-display-container">
      {text && !jsonData && (
        <button onClick={fetchData} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Summarize Text'}
        </button>
      )}
      {jsonData && <JSONPretty className="json-pre" id="json-pretty" data={jsonData}></JSONPretty>}
    </div>
  );
};

export default JsonDisplay;
