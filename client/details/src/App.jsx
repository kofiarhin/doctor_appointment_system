import { useEffect, useState } from 'react';
import { getHealth } from './api';

function App() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main>
      <h1>Doctor Appointment System</h1>
      <p data-testid="health-status">{status}</p>
    </main>
  );
}

export default App;
