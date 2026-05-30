import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLanguageColors } from '../constants/languageColors';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('token');
    navigate('/login');
    alert('Session expired. Please log in again.');
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/summary`, {
        headers: getAuthHeaders()
      });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      if (response.ok) setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchApplications = async (status = 'All') => {
    setLoading(true);
    setError('');
    try {
      const url = status === 'All'
        ? `${apiUrl}/api/applications`
        : `${apiUrl}/api/applications?status=${status.toLowerCase()}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      if (response.ok) {
        setApplications(data);
      } else {
        setError(data.error || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`${apiUrl}/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.status === 401) { handleUnauthorized(); return; }
      const data = await response.json();
      if (response.ok) {
        setApplications(prev => prev.map(app => (app.id === id ? data : app)));
        await fetchSummary();
        setSuccessMessage(`Application ${newStatus} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getLanguageBadgeStyle = (language) => {
    const colors = getLanguageColors(language);
    return { backgroundColor: colors.background, color: colors.text };
  };

  const getFilteredApplications = () => {
    if (!searchQuery.trim()) return applications;
    const query = searchQuery.toLowerCase();
    return applications.filter(app =>
      app.name.toLowerCase().includes(query) || app.mobile.includes(query)
    );
  };

  const handleFilterChange = (e) => {
    const newStatus = e.target.value;
    setFilteredStatus(newStatus);
    fetchApplications(newStatus);
  };

  useEffect(() => {
    fetchSummary();
    fetchApplications();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-banner">
        <div className="dashboard-banner-content">
          <h1>Dashboard</h1>
          <p>Manage and review loan applications</p>
        </div>
        {summary && (
          <div className="dashboard-banner-count">
            {summary.total} Application{summary.total !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="dashboard-content">
        {successMessage && (
          <div className="success-toast">{successMessage}</div>
        )}

        <div className="stats-bar">
          {!summary ? (
            <>
              <div className="stat-card skeleton"></div>
              <div className="stat-card skeleton"></div>
              <div className="stat-card skeleton"></div>
              <div className="stat-card skeleton"></div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-value">{summary.total}</div>
                <div className="stat-label">Total Applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{formatIndianCurrency(summary.totalAmount)}</div>
                <div className="stat-label">Total Amount</div>
              </div>
              <div className="stat-card stat-approved">
                <div className="stat-value">{summary.byStatus.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-card stat-rejected">
                <div className="stat-value">{summary.byStatus.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </>
          )}
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="status-filter">Filter by status:</label>
            <select
              id="status-filter"
              value={filteredStatus}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="search-group">
            <label htmlFor="search-input">Search:</label>
            <div className="search-input-wrapper">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or mobile..."
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')} aria-label="Clear search">
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          {loading ? (
            <div className="loading">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications found</h3>
              <p>
                {filteredStatus === 'All'
                  ? 'No loan applications have been submitted yet.'
                  : `No ${filteredStatus.toLowerCase()} applications found.`}
              </p>
            </div>
          ) : getFilteredApplications().length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No matching applications</h3>
              <p>No applications match your search criteria.</p>
              <button className="btn-clear-filters" onClick={() => setSearchQuery('')}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredApplications().map((app) => (
                    <tr key={app.id}>
                      <td>{app.name}</td>
                      <td>{app.mobile}</td>
                      <td>{formatIndianCurrency(app.amount)}</td>
                      <td className="purpose-cell">{app.purpose}</td>
                      <td>
                        <span className="badge language-badge" style={getLanguageBadgeStyle(app.language)}>
                          {app.language}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td>{formatDate(app.created_at)}</td>
                      <td>
                        {app.status === 'pending' && (
                          <div className="action-buttons">
                            <button
                              className="btn-approve"
                              onClick={() => updateStatus(app.id, 'approved')}
                              disabled={updatingId === app.id}
                            >
                              {updatingId === app.id ? '...' : 'Approve'}
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => updateStatus(app.id, 'rejected')}
                              disabled={updatingId === app.id}
                            >
                              {updatingId === app.id ? '...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
