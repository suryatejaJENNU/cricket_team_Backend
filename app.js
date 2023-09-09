const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

app.get("/players/", async (request, response) => {
  const Query = `
     select * from cricket_team
     ;`;
  const res = await db.all(Query);
  response.send(res);
});

app.post("/players/", async (request, response) => {
  const requestBody = request.body;
  const { playerName, jerseyNumber, role } = requestBody;
  const Query = `
    insert into cricket_team(player_name,jersey_number,role)
    values (
        '${playerName}',
        '${jerseyNumber}',
        '${role}'
    )
  ;`;
  const res = await db.run(Query);
  const player_id = res.lastID;
  response.send({ player_id: player_id });
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const Query = `
   select * from cricket_team 
   where player_id = '${playerId}';
  `;
  const res = await db.get(Query);
  response.send(res);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const requestBody = request.body;
  const { playerName, jerseyNumber, role } = requestBody;
  const Query = `
    update cricket_team 
    set 
    player_name = '${playerName}',
    jersey_number = '${jerseyNumber}',
    role = '${role}'
    
    where player_id = '${playerId}';
    `;
  const res = await db.run(Query);
  response.send("Player Details Updated");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const Query = `
   select * from cricket_team 
   where player_id = '${playerId}';
  `;
  const res = await db.get(Query);
  response.send(res);
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const Query = `
    delete  from cricket_team
    
    where player_id = '${playerId}';
    `;
  const res = await db.run(Query);
  response.send("Player Removed");
});

initializeDBAndServer();
