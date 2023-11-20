import React, { useState, useEffect } from 'react';
import { useAptos, useWallet } from '@aptos/react-sdk';

function App() {
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<Record<string, number>>({});
  const aptos = useAptos();
  const { connected, address } = useWallet();

  useEffect(() => {
    const fetchGameData = async () => {
      const totalClicksResult = await aptos.contract.query('ClickGame', 'getTotalClicks', []);
      const leaderboardResult = await aptos.contract.query('ClickGame', 'getLeaderboard', []);

      setTotalClicks(totalClicksResult);
      setLeaderboard(leaderboardResult);
    };

    const intervalId = setInterval(fetchGameData, 5000);

    return () => clearInterval(intervalId);
  }, [aptos.contract, connected, address]);

  const handleButtonClick = async () => {
    if (connected) {
      await aptos.contract.write('ClickGame', 'incrementClicks', []);
    }
  };

  return (
    <div className="App">
      <h1>Total Clicks: {totalClicks}</h1>
      <button onClick={handleButtonClick}>Click Me!</button>

      {connected && (
        <>
          <h2>Your Clicks: {leaderboard[address] || 0}</h2>
          <h2>Leaderboard:</h2>
          <ul>
            {Object.entries(leaderboard)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([userAddress, clicks]) => (
                <li key={userAddress}>
                  {userAddress.substring(0, 8)}: {clicks}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
