//This script was used to populate the database from a JSON file.
//Everything has been commented out for reference.
var admin = require("firebase-admin");
const fs = require('fs');
const _ = require('lodash');

const jsonFilePath = './v3_kanji_dict.json';
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));


var serviceAccount = require("./zenji-1e015-firebase-adminsdk-zbq4u-39991f3582.json");

const outPath = 'firebase_out.txt';

  const levelPath = 'kanjiJLPTLevels.json'

const chars = JSON.parse(fs.readFileSync(outPath, 'utf8'));
const levelMap = JSON.parse(fs.readFileSync(levelPath, 'utf8'));
console.log(levelMap);
const convertedChars = chars.map((char) => {
  
  return {
    
    ...char,
    data: {
      ...char.data,
      jlpt: levelMap[char.data.literal]? levelMap[char.data.literal]:"",

    }
  }
})

let counts = {};
convertedChars.forEach((char) => {
  if( counts[char.data.jlpt]) {
    counts[char.data.jlpt] += 1;
  }else {
    counts[char.data.jlpt] = 1;
  }
})
console.log(counts);

// fs.writeFile(outPath, JSON.stringify(arr), (err) => {
//   if (err) {
//       console.error('Error writing to file:', err);
//   } else {
//       console.log('Data has been written to', outPath);
//   }
// });

// admin.initializeApp({

//   credential: admin.credential.cert(serviceAccount)

// });


// const db = admin.firestore();


// const charRef = db.collection('Character');
// const snapshot = charRef.get().then((snapshot) => {
    
//     if (!snapshot) {
//         console.log('No matching documents.');
//         return;
//       }  
//       arr = []
//       snapshot.forEach((doc, index) => {

            
//         arr.push({id: doc.id, data: doc.data() })
//       });
//       fs.writeFile(outPath, JSON.stringify(arr), (err) => {
//         if (err) {
//             console.error('Error writing to file:', err);
//         } else {
//             console.log('Data has been written to', outPath);
//         }
//     });
//       //console.log(JSON.stringify(map));
// //     const result = _.groupBy(snapshot, ({ jlpt }) => jlpt);
// // Object.keys(result).forEach((key) => {
// //     console.log(key, ": ", result[key].length)
// // })
// });






// // const start = 0;
// // const chunkSize = 500;
// // //13108
// // const totalItems = jsonData.length;
// // console.log(totalItems)
// // //Change the thing to length
// // async function main() {
// // for (let i = 1000; i < totalItems; i += chunkSize) {

// //     const chunk = jsonData.slice(i, i + chunkSize);
    
// //     // Process the chunk
// //     await processChunk(chunk);

    
// // }
// // }

// // async function processChunk(chunk) {
// //     // Your processing logic for each chunk goes here
// //     console.log("Processing chunk:", chunk.length);
// //     // console.log(chunk[0])
// //     for (const doc of chunk) {
// //         await processDoc(doc);
// //       }

    
// //     console.log("Chunk Processed")

// // }

// // async function processDoc(doc) {
// //     db.collection('Character').add(doc).then((doc) => {
// //         if (doc) {
// //             console.log("Worked")
// //         }
// //         else {
// //             console.log("nothing")
// //         }
// //     }).catch((reason) => {
// //         console.log(reason)
// //     })
// // }

// // main();


// // db.collection('Character').doc('chkzxdlv4dB0JjG3ZJDn').get().then((doc) => {
// //     if (doc.exists) {
// //         console.log(doc.data())
// //     }
// //     else {
// //         console.log("nothing")
// //     }

// // }).catch((reason) => {
// //     console.log(reason)
// // })


// // const path = require("path");
// // const fs = require("fs");
// // const directoryPath = path.join(__dirname, "files");

// // fs.readdir(directoryPath, function(err, files) {
// //   if (err) {
// //     return console.log("Unable to scan directory: " + err);
// //   }

// //   files.forEach(function(file) {
// //     var lastDotIndex = file.lastIndexOf(".");

// //     var menu = require("./json_files/" + file);

// //     menu.forEach(function(obj) {
// //       firestore
// //         .collection(file.substring(0, lastDotIndex))
// //         .doc(obj.itemID)
// //         .set(obj)
// //         .then(function(docRef) {
// //           console.log("Document written");
// //         })
// //         .catch(function(error) {
// //           console.error("Error adding document: ", error);
// //         });
// //     });
// //   });
// // });