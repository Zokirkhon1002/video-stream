const express = require("express");
const fs = require("fs");
const path = require("path");


const app = express();


app.get("/",(req,res)=> {
    res.sendFile(__dirname + "/public/index.html");
})


app.get("/video",(req,res)=> {
    const range = req.headers.range;

    if(!range){
        res.status(400).send("Range paramater is missing!");
    }

    const pathToVideo = "full.mp4";
    const sizeOfVideo = fs.statSync("full.mp4").size;

    const CHUNK_SIZE = 1_000_000;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start+CHUNK_SIZE,sizeOfVideo-1);

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${sizeOfVideo}`,
        "Accept-Range":"bytes",
        "Content-Length":contentLength,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206,headers);

    const videoStream = fs.createReadStream(pathToVideo,{start,end});

    videoStream.pipe(res)
})



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`server running on port: ${PORT}`))