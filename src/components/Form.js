import React, { useState, useEffect } from 'react';
import './Form.css';
import { ProgressBar } from 'react-bootstrap'; // Ensure react-bootstrap is installed

const Form = () => {
  const [sheetId, setSheetId] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [webinarName, setWebinarName] = useState('');
  const [date, setDate] = useState('');
  const [organizedBy, setOrganizedBy] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState(null);
  const [logLoading, setLogLoading] = useState(false);

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
        fetchLogData(); // Fetch log data after successful certificate generation
      } else {
        setStatusMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setStatusMessage('An error occurred while generating certificates.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogData = async () => {
    setLogLoading(true);
    try {
      const response = await fetch('http://localhost:3000/fetch-logs');
      const result = await response.json();
      setLogData(result);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogData(null);
    } finally {
      setLogLoading(false);
    }
  };

  const calculatePercentage = (generated, total) => {
    if (!total) return 0;
    return ((generated / total) * 100).toFixed(2);
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
      {logLoading && <p className="mt-4">Loading log data...</p>}
      {logData && (
        <div className="mt-4">
          <h4>Certificates Generation Progress</h4>
          <ProgressBar
            now={calculatePercentage(logData.certificatesGenerated, logData.totalCertificates)}
            label={`${calculatePercentage(logData.certificatesGenerated, logData.totalCertificates)}%`}
          />
          <h4><p>Total Certificates Generated: {logData.totalCertificates}</p></h4>
          <h4><p>Certificates Sent Via Email: {logData.certificatesGenerated}</p></h4>
        </div>
      )}
    </div>
  );
};

export default Form;
