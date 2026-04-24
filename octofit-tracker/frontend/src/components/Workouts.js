import React, { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const baseUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`
    : 'http://localhost:8000/api/';
  const url = `${baseUrl}workouts/`;

  useEffect(() => {
    console.log('Fetching workouts from', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Workouts fetched data:', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setWorkouts(results);
      })
      .catch((err) => console.error('Error fetching workouts:', err))
      .finally(() => setLoading(false));
  }, [url]);

  const formatSuggestedFor = (suggestedFor) => {
    if (!Array.isArray(suggestedFor)) return suggestedFor || '';
    return suggestedFor
      .map((user) => (typeof user === 'string' ? user : user.name || user.email || user.id || ''))
      .filter(Boolean)
      .join(', ');
  };

  const filteredWorkouts = workouts.filter((workout) => {
    const suggestedForText = formatSuggestedFor(workout.suggested_for);
    return `${workout.name} ${workout.description} ${suggestedForText}`.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">Workouts</h3>
            <small className="text-dark">API endpoint: {url}</small>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
            API Info
          </button>
        </div>
        <div className="card-body">
          <form className="row g-3 align-items-center mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="col-auto flex-grow-1">
              <label htmlFor="workoutFilter" className="form-label visually-hidden">
                Search workouts
              </label>
              <input
                id="workoutFilter"
                type="text"
                className="form-control"
                placeholder="Filter workouts by name or description"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-primary" onClick={() => setFilter('')}>
                Clear
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" />
              <p className="mt-3">Loading workouts...</p>
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <p>No workouts match your search.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Suggested For</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>{workout.name}</td>
                      <td>{workout.description}</td>
                      <td>{formatSuggestedFor(workout.suggested_for)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-hidden="false">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Workouts API Info</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <p>The workouts data is fetched from:</p>
                  <code>{url}</code>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
};

export default Workouts;
