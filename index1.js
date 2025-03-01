
import express from "express";
import fs from "fs";
import path from "path";
const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));


// Set EJS as the templating engine
app.set("view engine", "ejs");
app.use(express.static("public"));
// Route to render the form
app.get("/", (req, res) => {
  res.render("index");
});
app.use(express.static("public"));
// Route to handle form submission
app.post("/calculate", (req, res) => {
  const { name1, name2 } = req.body;
  const loveScore = Math.floor(Math.random() * 100) + 1;
  if (!name1 || !name2) {
    return res.send("Both names are required!");
  }
  if (name1.toLowerCase() === name2.toLowerCase()) {
    return res.send(`
        <script>
            alert("Names must be different! ❌ Try again.");
            window.location.href = "/";
        </script>
    `);
  } let emoji = "";
  if (loveScore >= 80) {
    emoji = "😍";
  } else if (loveScore >= 50) {
    emoji = "😊";
  } else {
    emoji = "😢";
  }



  const result = `${name1} ❤️ ${name2} = ${loveScore}%\n`;
  fs.appendFile("names.txt", `${name1} - ${name2}\n`, (err) => {
    if (err) console.error("Error writing to file:", err);
  });

  // Render the result page with the calculated score and emoji
  res.render("result", { name1, name2, loveScore, emoji });
  // Save names in a file
  fs.appendFile("names.txt", `${name1} - ${name2}\n`, (err) => {
    if (err) console.log("Error writing to file:", err);
  });
});

// Route to show saved names
app.get("/names", (req, res) => {
  fs.readFile("names.txt", "utf8", (err, data) => {
    if (err) {
      return res.send("No names recorded yet.");
    }
    res.send(`<pre>${data}</pre><a href="/">Back</a>`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
