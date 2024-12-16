const axios = require("axios");
const express = require("express");

const baseUrl = "https://app.videas.fr/api/accounts/d0fbb237-3c30-431c-b839-1de8440c3315/";

const config = {
  headers: {
    "Cookie": "sessionid=myva80zyp1pqfgq9mmgaw232wpx82bbi"
  }
};

async function getFolders() {
  try {
    const response = await axios.get(baseUrl+"folders/", config);
    return response.data;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
};

async function getFolderId(folderName) {
  try {
    const response = await axios.get(baseUrl+"folders/", config);
    console.log(response.data);
    for (let folder of response.data) { 
	if (folder.name === folderName) { 
		return folder.uid; 
	}
    }
    return null;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
};

async function getFiles(folderId) {
  try {
    const response = await axios.get(baseUrl+"medias/", config);
    return response.data.filter(file=>folderId == file.folder);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return null;
  }
};

const app = express();

app.set('view engine', 'ejs')

app.get("/", async(req, res)=>{
  const folders = await getFolders();
  res.render("index", {folders: folders});
});

app.post("/folder/:folderName", async(req, res)=>{
  const folderId = req.query.folderId;
  const files = await getFiles(folderId);
  res.render("folder", {files: files});
});

app.get("/folder/:folderName", async(req, res)=>{
  const folderName = req.params.folderName;
  console.log(folderName);
  const folderId = await getFolderId(folderName);
  console.log(folderId);
  if (folderId == null) {return res.send("Not found");}
  const files = await getFiles(folderId);
  return res.render("folder", {files: files});
});

app.listen(3000, ()=>{console.log("running")});
