// Import JSONPretty and the adventure_time theme
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/adventure_time.css';
import './JsonDisplay.css'; // Ensure this path is correct

const JsonDisplay = ({ data }) => {
  return (
    <div className="json-display-container">
      <JSONPretty className="json-pre" id="json-pretty" data={data}></JSONPretty>
    </div>
  );
};

export default JsonDisplay;
