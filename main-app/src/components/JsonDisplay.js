import React, { useState } from 'react';
import { FaSpinner, FaCaretRight, FaCaretDown } from 'react-icons/fa';
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

  const CollapsibleSection = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="collapsible">
        <div className="collapsible-label" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaCaretDown /> : <FaCaretRight />} <strong>{label}</strong>
        </div>
        {isOpen && <div className="collapsible-content">{children}</div>}
      </div>
    );
  };

  const renderJson = (data, label = 'root') => {
    if (label === 'root' && data.response) {
      return renderJson(data.response, 'response');
    }
    if (typeof data === 'object' && data !== null) {
      const content = Object.entries(data).map(([key, value], index) => (
        <div key={index} className="json-entry">
          {renderJson(value, key)}
        </div>
      ));

      return (
        <CollapsibleSection label={label}>
          {content}
        </CollapsibleSection>
      );
    }
    return <span className="json-value">{JSON.stringify(data)}</span>;
  };

  return (
    <div className="json-display-container">
      {text && !jsonData && (
        <>
          <button onClick={fetchData}>
            {isLoading ? <><FaSpinner className="spinner" /> Loading...</> : 'Summarize Text'}
          </button>
        </>
      )}
      {jsonData && (
        <div className="json-content">
          {renderJson(jsonData)}
        </div>
      )}
    </div>
  );
};

export default JsonDisplay;
