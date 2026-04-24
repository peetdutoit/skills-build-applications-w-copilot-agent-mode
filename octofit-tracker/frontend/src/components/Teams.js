import React, { useEffect, useState } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const baseUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`
    : 'http://localhost:8000/api/';
  const url = `${baseUrl}teams/`;

  useEffect(() => {
    console.log('Fetching teams from', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Teams fetched data:', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setTeams(results);
      })
      .catch((err) => console.error('Error fetching teams:', err))
      .finally(() => setLoading(false));
  }, [url]);

  const filteredTeams = teams.filter((team) =>
    `${team.name} ${team.description}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">Teams</h3>
            <small className="text-light">Endpoint: {url}</small>
          </div>
          <button className="btn btn-light" onClick={() => setShowModal(true)}>
            API Info
          </button>
        </div>
        <div className="card-body">
          <form className="row g-3 align-items-center mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="col-auto flex-grow-1">
              <label htmlFor="teamFilter" className="form-label visually-hidden">
                Search teams
              </label>
              <input
                id="teamFilter"
                type="text"
                className="form-control"
                placeholder="Search by team name or description"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-info text-white" onClick={() => setFilter('')}>
                Clear
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status" />
              <p className="mt-3">Loading teams...</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <p>No teams match your search.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Team</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>{team.description}</td>
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
                <h5 className="modal-title">Teams API Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>Fetching teams from:</p>
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

export default Teams;
