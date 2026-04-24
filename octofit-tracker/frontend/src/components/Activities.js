import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const baseUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`
    : 'http://localhost:8000/api/';
  const url = `${baseUrl}activities/`;

  useEffect(() => {
    console.log('Fetching activities from', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Activities fetched data:', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setActivities(results);
      })
      .catch((err) => console.error('Error fetching activities:', err))
      .finally(() => setLoading(false));
  }, [url]);

  const filteredActivities = activities.filter((activity) =>
    `${activity.user?.name || ''} ${activity.type} ${activity.date}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">Activities</h3>
            <small className="text-light">Endpoint: {url}</small>
          </div>
          <button className="btn btn-light" onClick={() => setShowModal(true)}>
            API Info
          </button>
        </div>
        <div className="card-body">
          <form className="row g-3 align-items-center mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="col-auto flex-grow-1">
              <label htmlFor="activityFilter" className="form-label visually-hidden">
                Search activities
              </label>
              <input
                id="activityFilter"
                type="text"
                className="form-control"
                placeholder="Search by user, type, or date"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-outline-light text-primary" onClick={() => setFilter('')}>
                Clear
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <p>No activities match your search.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Type</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.user?.name || 'Unknown'}</td>
                      <td>{activity.type}</td>
                      <td>{activity.duration} mins</td>
                      <td>{activity.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activities API Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>Fetching activities from:</p>
                <code>{url}</code>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}
    </div>
  );
};

export default Activities;
