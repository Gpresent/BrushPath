/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
var admin = require("firebase-admin");
var serviceAccount = require("./zenji-1e015-firebase-adminsdk-zbq4u-39991f3582.json");


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount)

});
const db = admin.firestore();
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.writeJLPTDecks = onDocumentWritten("User/{docId}", (event) => {
    console.log(event.params.docId)
    // console.log(event.params.userId)
    var userRef = db.collection("User").doc(event.params.docId);

    return userRef.update({
        decks: [db.doc("Deck/JLPT_1"), db.doc("Deck/JLPT_2"), db.doc("Deck/JLPT_3"), db.doc("Deck/JLPT_4"), db.doc("Deck/JLPT_5")]
    })
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
