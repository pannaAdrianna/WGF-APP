import {useState} from "react";

class Test {

    constructor( data) {
    // constructor(date, id, owner, ownerEmail, url) {
        // this.date = date
        // this.id = id
        // this.owner = owner
        // this.ownerEmail = ownerEmail
        // this.url = url

        // this.date = date
        this.id = data.id
        // this.owner = owner
        // this.ownerEmail = ownerEmail
        this.url = data.url
        this.date= new Date(data.createdAt)

    }


}


export default Test;