const express = require("express");
const router = express.Router();
const Account = require("../models/account");

router.post("/", async (req, res) => {
  console.log(req.body); // Log the incoming request body
  try {
    const newAccount = new Account(req.body);
    await newAccount.save();
    res.status(201).send(newAccount);
  } catch (error) {
    console.error(error); // Log any errors
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

router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    delete updates._id;
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!updatedAccount) {
      return res.status(404).send();
    }
    res.send(updatedAccount);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    if (!deletedAccount) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
