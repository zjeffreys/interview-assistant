import React, { useState } from 'react';
import { FaSpinner, FaCaretRight, FaCaretDown } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel'; // Ensure this is installed
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Default styles
import './JsonDisplay.css'; // Ensure this path is correct


const JsonDisplay = ({ filename, text }) => {
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const keyEmojiMap = {
    "User Persona": "👤",
    "role": "🔑",
    "characteristics": "📌",
    "needs": "🛠️",
    "Key Challenges": "🚧",
    "key challenges": "🚧",
    "Interviewer Focus Areas": "🎯",
    "Insights from Responses": "💡",
    "Questions and Answers": "❓",
    "Additional Insights": "🔍",
    "Metadata": "📇",
    "Revenue generation strategies": "💵",
    "Customer retention tactics": "❤️",
    "Market trend analysis": "📊",
    "market_trends": "🌐",
    "innovation_strategies": "💡",
    "customer_demographics": "👥",
    "future_goals": "🚀",
    "business_sector": "🏭",
    // Add more mappings as needed
  };

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

  const UserProfile = ({ role }) => (
    <div className="user-profile">
      <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="Profile" />
      <h3>{role}</h3>
    </div>
  );

  const renderCarouselData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value], index) => (
        <div key={index}>
          <h2>{key}</h2>
          {typeof value === 'string' ? (
            <p>{value}</p>
          ) : (
            <div>{renderJson(value)}</div>
          )}
        </div>
      ));
    }
    return null;
  };

  const renderJson = (data, label = 'root') => {
    if (label === 'root' && data.response) {
      return renderJson(data.response, 'response');
    }
  
    if (Array.isArray(data)) {
      return (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {typeof item === 'string' ? item : renderJson(item)}
            </li>
          ))}
        </ul>
      );
    }
  
    if (typeof data === 'object' && data !== null) {
      const content = Object.entries(data)
        .filter(([key]) => key !== "role") // Keep filtering out "role"
        .map(([key, value], index) => {
          console.log("Key:", key); // Log the current key
          const emoji = keyEmojiMap[key] ? `${keyEmojiMap[key]} ` : ''; // Assuming case sensitivity is handled
          console.log("Emoji:", emoji); // Log the corresponding emoji
    
          // Check if the key is "question" or "answer" to render value without key
          if (key === "question" || key === "answer") {
            return (
              <div key={index} className="json-entry">
                {/* Render the value directly without the key */}
                <p>{value}</p>
              </div>
            );
          } else {
            // For other keys, render as before
            return (
              <div key={index} className="json-entry">
                <h3>{emoji}{key}</h3>
                {renderJson(value)}
              </div>
            );
          }
        });
    
      return <div>{content}</div>;
    }
    
  
    return <span className="json-value">{JSON.stringify(data)}</span>;
  };
  
  
  
  

  return (
    <div className="json-display-container">
      {text && !jsonData && (
        <button onClick={fetchData}>
          {isLoading ? <><FaSpinner className="spinner" /> Loading...</> : 'Summarize Text'}
        </button>
      )}
      {jsonData && (
        <div className="json-display-flex">
          <UserProfile role={jsonData.response["User Persona"].role} />
          <div className="json-carousel-container">
            <Carousel showArrows={true} infiniteLoop={true} showThumbs={true}>
              {renderCarouselData(jsonData.response)}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonDisplay;
