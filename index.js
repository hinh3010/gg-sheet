const express = require("express");
const { google } = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

// gg-sheet@gg-sheet-372013.iam.gserviceaccount.com
app.get("/sheet", async (req, res) => {
    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "14t1UAklyFYqAfIMMQDTA3qHl5ttRHy03itqwsopZHTg";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: metaData.data.sheets[0].properties.title,
    });
    res.send(getRows.data);




});


app.post("/sheet", async (req, res) => {
    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "14t1UAklyFYqAfIMMQDTA3qHl5ttRHy03itqwsopZHTg";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });


    // Write row(s) to spreadsheet
    try {
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: metaData.data.sheets[0].properties.title + "!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    ["cacban2", "tre"],
                    ["cacban3", "tre"],
                    [request, name],
                ],
            },
        });

        res.send("Successfully submitted! Thank you!");
    } catch (error) {
        res.send(error.message || error);
    }
});

app.listen(1337, (req, res) => console.log("running on 1337"));
