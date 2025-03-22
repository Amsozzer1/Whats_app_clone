// import {app,db} from './FirebaseSecrets';
// import { collection, addDoc } from "firebase/firestore"; 

// async function sendData(){
//     try {
//         const docRef = await addDoc(collection(db, "users"), {
//         first: "Ada",
//         last: "Lovelace",
//         born: 1815
//         });
//         console.log("Document written with ID: ", docRef.id);
//         return true;
//     } catch (e) {
//         console.error("Error adding document: ", e);
//         return false;
//     }
// }
// export {sendData};