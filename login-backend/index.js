const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db;

// Verbind met MongoDB
async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db("BrotherDB").collection("brotherCOL"); // Update database and collection name
    console.log("Verbonden met MongoDB");
}

// Inlog route
app.post("/api/login", async (req, res) => {
    const { naam, wachtwoord } = req.body;
    try {
        const gebruiker = await db.findOne({ naam });
        if (gebruiker && gebruiker.wachtwoord === wachtwoord) {
            res.json({ success: true, message: `Welkom, ${naam}!` });
        } else {
            res.json({ success: false, message: "Onjuiste inloggegevens" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start de server en verbind met MongoDB
app.listen(port, async () => {
    await connectToDatabase();
    console.log(`Server draait op poort ${port}`);
});
