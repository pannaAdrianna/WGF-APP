import {doc, deleteDoc, getDoc, updateDoc, query, collection, getDocs, setDoc} from "firebase/firestore";
import {db} from "./Firebase";
import Game, {gameConverter} from "./sections/@dashboard/games/Game";
import { getDatabase, ref, child, push, update } from "firebase/database";

export async function getGameInfoById(id) {
    let game = {}
    const ref = (doc(db, "games", id).withConverter(gameConverter));
    const docSnap = await getDoc(ref)
    if (docSnap.exists()) {
        game = docSnap.data()
        console.log('game', game);
    }

    return game
}

export async function deleteGameById(id) {
    await deleteDoc(doc(db, "games", id));
}

export async function updateGameStatus(id, new_status) {
    const ref = (doc(db, "games", id).withConverter(gameConverter));
    await updateDoc(ref, {
        status: new_status
    });
}

export async function updateGame(game) {
    const ref = (doc(db, "games", game.id).withConverter(gameConverter));


    await updateDoc(ref, {
        name: game.name,
        lastEditBy: game.lastEditBy,
        status: game.status,
        lastUpdate: game.lastUpdate
    });


}

export function addNewGame(game) {
    setDoc(doc(db, 'games', (game.id)), game, {merge: true}).then(r =>
    console.log('response', r))
}


const q = query(collection(db, 'games'));

export async function getAllGames() {
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.docs.forEach((doc) => {
        items.push(doc.data());
    });
    return items
};


/*
const ref = doc(db, "games", "LA").withConverter(gameConverter);
const docSnap = await getDoc(ref);
if (docSnap.exists()) {
    // Convert to City object
    const city = docSnap.data();
    // Use a City instance method
    console.log(city.toString());
} else {
    console.log("No such document!");
}*/


export function writeNewPost(uid, username, picture, title, body) {
    // A post entry.
    const postData = {
        author: username,
        uid: uid,
        body: body,
        title: title,
        starCount: 0,
        authorPic: picture
    };

    // Get a key for a new Post.
    const newPostKey = push(child(ref(db), 'posts')).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return update(ref(db), updates);
}
