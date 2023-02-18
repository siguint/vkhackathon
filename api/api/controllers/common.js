import { clientPromise } from "../utils/mongodb";

const getEvent = async (req, res) => {
    const client = await clientPromise
    const collection = client.db(DB_NAME).collection('Events')
    const cursor = await collection.find({address : req.params.address})
    let events = await cursor.toArray()
    res.status(200).json({ result: events });
  };