import {
    doc,
    onSnapshot,
    deleteDoc,
    getDoc,
    updateDoc,
    query,
    collection,
    getDocs,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import {db} from "../Firebase";
import Game, {gameConverter} from "../sections/@dashboard/games/Game";
import {getDatabase, ref, child, push, update,orderByChild} from "firebase/database";
import {useState} from "react";
import {namesFromMail} from "../utils/strings";
import {useAuth} from "../sections/auth/contexts/AuthContext";

export function addPlayer(player) {
    setDoc(doc(db, 'players', (player.id)), player, {merge: true}).then
    ((r) => {
            return (r)
        },
    );
}


export const getGameInfoById = async (id) => {

    /*
        const unsub = onSnapshot(doc(db, "games", id), (doc) => {
            console.log("Current data: ", doc.data());
        });*/

    await getDoc(doc(db, 'games', id)).then((docSnap) => {
        if (docSnap.exists()) {
            console.log('inne', docSnap.data())

        }

    })


}

export const getGameInfo = (id) => {

    let game = []
    onSnapshot(doc(db, "games", id).withConverter(gameConverter), (doc) => {
            game = doc.data()

        }
    )

    return game

}

export async function deleteGameById(id) {
    await deleteDoc(doc(db, "games", id));
}

export async function updateGameStatus(id, info) {
    const ref = (doc(db, "games", id).withConverter(gameConverter));
    await updateDoc(ref, {
        status: info.new_status,
        lastEditBy: info.lastEditBy,
        lastUpdate: serverTimestamp(),
        rentedBy: info.rentedBy
    });
}


export async function updateGame(game) {
    const ref = (doc(db, "games", game.id).withConverter(gameConverter));
    await updateDoc(ref, {
        name: game.name,
        lastEditBy: game.lastEditBy,
        status: game.status,
        lastUpdate: serverTimestamp(),
    });


}


export function addNewRental(rental, game, info) {
    setDoc(doc(db, `rentals/${game.id}/rentals/${rental.id}`), rental, {merge: true}).then((r) => {
        updateGameStatus(game.id, info).then(r => {
            console.log('resp from updating Game', r)
        })

    })
}

export async function getRentalHistoryOfGame(game_id) {
    let history = []
    let query = await getDocs(collection(db, `rentals/${game_id}/rentals`))
    query.docs.forEach((doc) => {
        history.push(doc.data());
    });

    return history;
}

export async function updateRental(reference, info) {

}


export function addNewGame(game) {
    setDoc(doc(db, 'games', (game.id)), game, {merge: true}).then(r =>
        console.log('response', r))
}

export function addNewImported(game) {
    setDoc(doc(db, 'imported', (game.id)), game, {merge: true}).then(r =>
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
