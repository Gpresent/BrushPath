//This script was used to populate the database from a JSON file.
//Everything has been commented out for reference.
var admin = require("firebase-admin");
const fs = require("fs");
const _ = require("lodash");

var serviceAccount = require("./zenji-1e015-firebase-adminsdk-zbq4u-39991f3582.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const charactersRef = db.collection('Character');
const decksRef = db.collection('Deck');


// const characterRef = doc(db, "Character");

// // Set the "capital" field of the city 'DC'
// await updateDoc(characterRef, {
//   capital: true
// });

// async function updateCharacterMeanings() {
//     try {
//       for (const entry of entries) {
//         const { unicode, one_word_meaning } = entry;
//         const snapshot = await charactersRef.where('unicode_str', '==', unicode).get();

//         if (snapshot.empty) {
//           console.log(`No matching document found for unicode ${unicode}`);
//           continue;
//         }

//         snapshot.forEach(doc => {
//           charactersRef.doc(doc.id).update({ one_word_meaning });
//           console.log(`Updated one_word_meaning for unicode ${unicode}`);
//         });
//       }
//     } catch (error) {
//       console.error('Error updating character meanings:', error);
//     }
//   }

//   updateCharacterMeanings();

// const jsonFilePath = './utils/singleMeanings.json';
// const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

const entries = require("./singleMeanings.json");

async function updateCharacterMeanings() {
  // fetch('./singleMeanings.json')
  // JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
  // .then((response) => response.json())
  // .then(async (json) => {
    // const jsonFilePath = './utils/singleMeanings.json';
    // const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  try {
    for (const entry of entries) {
      const { unicode, one_word_meaning } = entry;
      const snapshot = await charactersRef
        .where("literal", "==", unicode)
        .get();

      if (snapshot.empty) {
        console.log(`No matching document found for unicode ${unicode}`);
        continue;
      }

      snapshot.forEach((doc) => {
        charactersRef.doc(doc.id).update({ one_word_meaning });
        console.log(`Updated one_word_meaning for unicode ${unicode}`);
      });
    }
  } catch (error) {
    console.error("Error updating character meanings:", error);
  }
}

async function convertStringToReference() {
  deckId = "JLPT_4";
  try {
    const deckSnapshot = await decksRef.doc(deckId).get();

    if (!deckSnapshot.exists) {
      console.log('Deck does not exist');
      return;
    }

    const deckData = deckSnapshot.data();

    // Check if the 'characters' field exists and is an array
    if (Array.isArray(deckData.characters)) {
      const charactersArray = deckData.characters;

      // Iterate over the characters array
      for (let i = 0; i < charactersArray.length; i++) {
        const character = charactersArray[i];

        // Check if the element is a string
        if (typeof character === 'string') {
          // Query the database to find the character reference
          const characterSnapshot = await db.doc(character).get();

          // If a character with the given Unicode exists
          if (!characterSnapshot.empty) {
            const characterRef = characterSnapshot.ref;
            // Replace the string with the reference
            charactersArray[i] = characterRef;
          } else {
            console.log(`Character with Unicode ${character} not found.`);
          }
        }
      }

      // Update the deck document with the modified characters array
      await decksRef.doc(deckId).update({ characters: charactersArray });
      console.log(`Converted strings to references for deck with ID ${deckId}`);
    } else {
      console.log('Characters field is not an array or does not exist');
    }
  } catch (error) {
    console.error('Error converting strings to references:', error);
  }
}

convertStringToReference();

// updateCharacterMeanings();

// const charsObject = JSON.parse(json);
// const charsMap = new Map(Object.entries(charsObject));

// const charRef = db.collection('Character');
// const snapshot = charRef.where('jlpt', '>', '').get().then((snapshot) => {
//     if (!snapshot) {
//         console.log('No matching documents.');
//         return;
//     }
//     map = {}
//     snapshot.forEach((doc) => {
//         if(doc.data().unicode_str){
//             if(!map[doc.data().one_word_meaning]) {
//                 map[doc.data().one_word_meaning] = [doc.data()]
//             }
//             else {
//                 map[doc.data().one_word_meaning] = (doc.data())
//             }
//         }
//         // Access the document data using doc.data()

//     });
// console.log(JSON.stringify(map));
//     const result = _.groupBy(snapshot, ({ jlpt }) => jlpt);
// Object.keys(result).forEach((key) => {
//     console.log(key, ": ", result[key].length)
// })
// });

// const start = 0;
// const chunkSize = 500;
// //13108
// const totalItems = jsonData.length;
// console.log(totalItems)
// //Change the thing to length
// async function main() {
// for (let i = 1000; i < totalItems; i += chunkSize) {

//     const chunk = jsonData.slice(i, i + chunkSize);

//     // Process the chunk
//     await processChunk(chunk);

// }
// }

// async function processChunk(chunk) {
//     // Your processing logic for each chunk goes here
//     console.log("Processing chunk:", chunk.length);
//     // console.log(chunk[0])
//     for (const doc of chunk) {
//         await processDoc(doc);
//       }

//     console.log("Chunk Processed")

// }

// async function processDoc(doc) {
//     db.collection('Character').add(doc).then((doc) => {
//         if (doc) {
//             console.log("Worked")
//         }
//         else {
//             console.log("nothing")
//         }
//     }).catch((reason) => {
//         console.log(reason)
//     })
// }

// main();

// db.collection('Character').doc('chkzxdlv4dB0JjG3ZJDn').get().then((doc) => {
//     if (doc.exists) {
//         console.log(doc.data())
//     }
//     else {
//         console.log("nothing")
//     }

// }).catch((reason) => {
//     console.log(reason)
// })

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
