var admin = require("firebase-admin");
const fs = require('fs');

const jsonFilePath = './updated_kanji_data.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));


var serviceAccount = require("./zenji-1e015-firebase-adminsdk-zbq4u-39991f3582.json");


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount)

});


const db = admin.firestore();
const start = 0;
const chunkSize = 10;
const totalItems = jsonData.length;
console.log(totalItems)
//Change the thing to length
// for (let i = 0; i < 20; i += chunkSize) {

//     const chunk = jsonData.slice(i, i + chunkSize);
    
//     // Process the chunk
//     processChunk(chunk);
// }

// function processChunk(chunk) {
//     // Your processing logic for each chunk goes here
//     console.log("Processing chunk:", chunk.length);
//     // console.log(chunk[0])
//     db.collection('Character').add(chunk[0]).then((doc) => {
//     if (doc.exists) {
//         console.log(doc.data())
//     }
//     else {
//         console.log("nothing")
//     }

//     }).catch((reason) => {
//         console.log(reason)
//     })
//     console.log("Chunk Processed")

// }

const characterRef = await db.collection("Character");
const q = query(characterRef, where('misc', '!=', 'sam'))

const querySnapshot = await getDocs(q);
db.collection('Character').doc('chkzxdlv4dB0JjG3ZJDn').get().then((doc) => {
    if (doc.exists) {
        console.log(doc.data())
    }
    else {
        console.log("nothing")
    }

}).catch((reason) => {
    console.log(reason)
})


// const path = require("path");
// const fs = require("fs");
// const directoryPath = path.join(__dirname, "files");

// fs.readdir(directoryPath, function(err, files) {
//   if (err) {
//     return console.log("Unable to scan directory: " + err);
//   }

//   files.forEach(function(file) {
//     var lastDotIndex = file.lastIndexOf(".");

//     var menu = require("./json_files/" + file);

//     menu.forEach(function(obj) {
//       firestore
//         .collection(file.substring(0, lastDotIndex))
//         .doc(obj.itemID)
//         .set(obj)
//         .then(function(docRef) {
//           console.log("Document written");
//         })
//         .catch(function(error) {
//           console.error("Error adding document: ", error);
//         });
//     });
//   });
// });
