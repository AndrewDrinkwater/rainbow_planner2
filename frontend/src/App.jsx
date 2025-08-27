import React, { useEffect, useState } from 'react';

export default function App() {
  const [girls, setGirls] = useState([]);

  useEffect(() => {
    fetch('/girls')
      .then(res => res.json())
      .then(setGirls)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Rainbow Planner</h1>
      <ul>
        {girls.map(girl => (
          <li key={girl.id}>
            {girl.first_name} {girl.last_name} - {girl.age} ({girl.state})
          </li>
        ))}
      </ul>
    </div>
  );
}
