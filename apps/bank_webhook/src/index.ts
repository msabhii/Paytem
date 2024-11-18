import db from "@repo/db/client";
import express from "express";
import z, { string } from "zod";

const app = express();
app.use(express.json());

const userInputValidation = z.object({
  token: string(),
  userId: string(),
  amount: string().optional(),
});

app.post("/hdfcWebhook", async (req, res) => {
  //TODO: Add zod validation here?
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  const validateInput = userInputValidation.safeParse(paymentInformation);
  if (!validateInput) {
    return res.status(400).json({ msg: "Not valid inputs" });
  }

  await db.balance.update({
    where: {
      userId: paymentInformation.userId,
    },
    data: {
      amount: {
        increment: paymentInformation.amount,
      },
    },
  });

  await db.onRampTransaction.update({
    where: {
      token: paymentInformation.token,
    },
    data: {
      status: "Success",
    },
  });

  res.status(200).json({
    msg: "captured",
  });

  // Update balance in db, add txn
});
