const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from the file
function readData() {
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
}

// Function to save data to the file
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

let { ElderShip } = readData();

app.get("/api/elders", (req, res) => {
  res.json(ElderShip);
});

app.get("/api/elders/:id", (req, res) => {
  const elderId = parseInt(req.params.id);
  const singleElder = ElderShip.find(elder => elder.id === elderId);
  if (!singleElder) {
    return res.status(404).json({ message: "Elder data was not found" });
  }
  res.json(singleElder);
});

app.get("/api/elders/:id/priests/:prstAdminSortName", (req, res) => {
  const elderId = parseInt(req.params.id);
  const prstAdminSortName = req.params.prstAdminSortName;
  const elder = ElderShip.find(elder => elder.id === elderId);
  if (!elder) {
    return res.status(404).json({ message: "Elder data was not found" });
  }
  const priest = elder.priests.find(priest => priest.prstAdminSortName === prstAdminSortName);
  if (!priest) {
    return res.status(404).json({ message: "Priest data was not found" });
  }
  res.json(priest);
});

app.get("/api/elders/:id/priests/:prstAdminSortName/families/:familyName", (req, res) => {
  const elderId = parseInt(req.params.id);
  const prstAdminSortName = req.params.prstAdminSortName;
  const familyName = req.params.familyName;
  const elder = ElderShip.find(elder => elder.id === elderId);
  if (!elder) {
    return res.status(404).json({ message: "Elder data was not found" });
  }
  const priest = elder.priests.find(priest => priest.prstAdminSortName === prstAdminSortName);
  if (!priest) {
    return res.status(404).json({ message: "Priest data was not found" });
  }
  const family = priest.families.find(family => family.name === familyName);
  if (!family) {
    return res.status(404).json({ message: "Family data was not found" });
  }
  res.json(family);
});

app.get("/api/elders/:id/priests/:prstAdminSortName/families/:familyName/members/:UID", (req, res) => {
  const elderId = parseInt(req.params.id);
  const prstAdminSortName = req.params.prstAdminSortName;
  const familyName = req.params.familyName;
  const UID = req.params.UID;
  const elder = ElderShip.find(elder => elder.id === elderId);
  if (!elder) {
    return res.status(404).json({ message: "Elder data was not found" });
  }
  const priest = elder.priests.find(priest => priest.prstAdminSortName === prstAdminSortName);
  if (!priest) {
    return res.status(404).json({ message: "Priest data was not found" });
  }
  const family = priest.families.find(family => family.name === familyName);
  if (!family) {
    return res.status(404).json({ message: "Family data was not found" });
  }
  const member = family.members.find(member => member.UID === UID);
  if (!member) {
    return res.status(404).json({ message: "Member data was not found" });
  }
  res.json(member);
});

app.put("/api/elders/:id/priests/:prstAdminSortName/families/:familyName/members/:UID", (req, res) => {
  try {
    const elderId = parseInt(req.params.id);
    const prstAdminSortName = req.params.prstAdminSortName;
    const familyName = req.params.familyName;
    const UID = req.params.UID;
    const updatedData = req.body;

    const elder = ElderShip.find(elder => elder.id === elderId);
    if (!elder) {
      return res.status(404).json({ message: "Elder data was not found" });
    }

    const priest = elder.priests.find(priest => priest.prstAdminSortName === prstAdminSortName);
    if (!priest) {
      return res.status(404).json({ message: "Priest data was not found" });
    }

    const family = priest.families.find(family => family.name === familyName);
    if (!family) {
      return res.status(404).json({ message: "Family data was not found" });
    }

    const member = family.members.find(member => member.UID === UID);
    if (!member) {
      return res.status(404).json({ message: "Member data was not found" });
    }

    // Update the member data
    Object.assign(member, updatedData);

    // Save the updated data back to the file
    saveData({ ElderShip });

    res.json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "An error occurred while updating the member data." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

require("dotenv").config();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
