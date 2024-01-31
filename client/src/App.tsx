import React, {useEffect, useState} from 'react'

interface UserData {
  users: string[]; 
}

export function App() {
const [backendData, setBackendData] = useState<UserData>({ users: [] });

useEffect(() => {
  fetch("/api")
    .then(response => response.json())
    .then((data: UserData) => {
      setBackendData(data);
    });
}, []);

return (
  <div>
    {backendData.users.length === 0 ? (
      <p> Loading... </p>
    ) : (
      backendData.users.map((user, i) => (
        <p key={i}> {user} </p>
      ))
    )}
  </div>
);
}

export default App