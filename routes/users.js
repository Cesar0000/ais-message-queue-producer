import express from "express";
import { v4 as uuidv4 } from "uuid";
import { send } from "../services/amqp.js"

const router = express.Router();

let users = []

router.get("/", (req, res) => {
    res.send(users);
});

router.post("/", (req, res) => {
    const user = req.body;
    const userId = uuidv4();
    users.push({ ...user, id: userId });
    const currentDate = new Date();
    const dateString = currentDate.toString();
    send(`New user with id ${userId} added at ${dateString} with "${user.firstName}" as first name, "${user.lastName}" as last name and with ${user.age} as age`);
    res.send(`User with the name ${user.firstName} added to the database`);
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const foundUser = users.find(user => user.id === id);
    res.send(foundUser);
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter(user => user.id !== id);
    res.send(`User iwth the id ${id} deleted from the database`);
});

router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === id);
    const { firstName, lastName, age } = req.body;
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (age) {
        user.age = age;
    }
    res.send(`User with the id ${id} has been updated`);
});

export default router;