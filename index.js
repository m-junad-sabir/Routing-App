const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors());

// The Endpoint
app.get('/route', async (req, res) => {
    try {
        // 1. Get coordinates from the URL (?start=lat,lon&end=lat,lon)
        const { start, end } = req.query;
        
        if(!start || !end) return res.status(400).send("Missing coordinates");

        // 2. Formatting: Split the strings. 
        // NOTE: GIS standard is [Lon, Lat], but input is usually Lat,Lon. We must swap them.
        const startCoords = start.split(',').reverse(); // Turns "33.6,73.0" into ["73.0", "33.6"]
        const endCoords = end.split(',').reverse();

        // 3. Call the external Routing Engine (OpenRouteService)
        const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car`;
        const response = await axios.get(orsUrl, {
            params: {
                api_key: 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc1YTc4ZDc3MTMyYTQyYTFhZGZmZGJiNDBjZmQ3MmQ0IiwiaCI6Im11cm11cjY0In0=', // PASTE KEY HERE
                start: startCoords.join(','),
                end: endCoords.join(',')
            }
        });

        // 4. Send the clean GeoJSON back to the user
        res.json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Routing API running at http://localhost:3000"));