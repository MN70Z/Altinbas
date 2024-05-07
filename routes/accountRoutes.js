const express = require('express');
const router = express.Router();
const Account = require('../models/account');

router.post("/", async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        await newAccount.save();
        res.status(201).send(newAccount);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find({});
        res.status(200).send(accounts);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put("/:accountNumber", async (req, res) => {
    try {
        const updatedAccount = await Account.findOneAndUpdate(
            { accountNumber: req.params.accountNumber }, 
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAccount) {
            return res.status(404).send();
        }
        res.send(updatedAccount);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/:accountNumber", async (req, res) => {
    try {
        const deletedAccount = await Account.findOneAndDelete({ accountNumber: req.params.accountNumber });
        if (!deletedAccount) {
            return res.status(404).send();
        }
        res.status(204).send(deletedAccount);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
