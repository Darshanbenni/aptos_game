# aptos_game
# Click Game DApp

This is a simple decentralized application (DApp) built on the Aptos blockchain. The game allows users to click a button, incrementing a global counter stored on the blockchain. Additionally, there is a leaderboard showcasing the top users with the most clicks.

## Smart Contract (my-game)

### ClickGame Contract

The `ClickGame` smart contract is responsible for managing the total clicks and a user leaderboard.

```javascript
contract ClickGame {
  storage {
    totalClicks: u32 = 0;
    leaderboard: map(address, u32) = {};
  }

  entrypoint getTotalClicks() : u32 =
    state.totalClicks

  entrypoint incrementClicks() =
    let userAddress = Call.caller
    put(state{totalClicks = state.totalClicks + 1})
    put(state{leaderboard[userAddress] = state.leaderboard[userAddress] + 1})

  entrypoint getLeaderboard() : map(address, u32) =
    state.leaderboard
}
