import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  const [sheetId, setSheetId] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [webinarName, setWebinarName] = useState('');
  const [date, setDate] = useState('');
  const [organizedBy, setOrganizedBy] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatusMessage('Generating and sending certificates, please wait...');

    try {
      const response = await fetch('http://localhost:3000/generate-certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetId,
          sheetName,
          webinarName,
          date,
          organizedBy,
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setStatusMessage('Certificates generated and sent successfully!');
      } else {
        setStatusMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setStatusMessage('An error occurred while generating certificates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">LUNEBLAZE CERTIFICATES GENERATOR</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Google Sheets ID</label>
          <input
            type="text"
            className="form-control"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Sheet Name</label>
          <input
            type="text"
            className="form-control"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Webinar Name</label>
          <input
            type="text"
            className="form-control"
            value={webinarName}
            onChange={(e) => setWebinarName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Organized By</label>
          <input
            type="text"
            className="form-control"
            value={organizedBy}
            onChange={(e) => setOrganizedBy(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Generating and Sending Certificates...' : 'Generate and Send Certificates'}
        </button>
      </form>
      {statusMessage && (
        <div className="alert alert-info mt-4" role="alert">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Form;
