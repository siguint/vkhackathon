import express from "express";

import { submitEvent, getEvent, getAllEvents } from "../controllers/admin";

const router = express.Router();

router.post("/:id", validateObjectId, submitEvent);

router.get("/:address", validateAddress, getEvent);

router.get("/events", getAllEvents);

router 
export default router;
