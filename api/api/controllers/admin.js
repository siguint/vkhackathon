import { clientPromise } from "../utils/mongodb";
import { ethers } from "ethers"

const submitEvent = async (req, res) => {
  res.status(200).json({ success: true });
};

const getEvent = async (req, res) => {
  try {
    const client = await clientPromise
    const collection = client.db(DB_NAME).collection('Events')
    const event = await collection.findOne({address : req.params.address})
    res.status(200).json({ success: true, result: event });
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }
};

const getToken = async (req, res) => {
  try {
    const client = await clientPromise
    const collection = client.db(DB_NAME).collection('Tokens')
    const token_id = await collection.findOne({address : req.params.address, token_id : req.params.token_id})
    res.status(200).json({ result: token_id });
  } catch (e) {
  res.status(400).json({ success: false, result: e.message });
  }
};

const getAllEvents = async (req, res) => {//all events
  try {
    const client = await clientPromise
    const collection = await client.db(DB_NAME).collection('Events');
    const cursor = await collection.find({})
    let events = await cursor.toArray()
    res.status(200).json({ result: events })
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }
};

const getAllTokens = async (req, res) => {//all tokens from event
  try {
    const client = await clientPromise
    const collection = await client.db(DB_NAME).collection('Tokens')
    const cursor = await collection.find({address: req.params.address})
    let tokens = await cursor.toArray()
    res.status(200).json({ result: tokens })
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }   
};

const getTree = async (req, res) => {
  try {
    const client = await clientPromise
    const collection = await client.db(DB_NAME).collection('Trees')
    const tree = await collection.find({event: req.params.event})
    res.status(200).json({result : tree})
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }
}
//all events
const getTreeProof = async (req, res) => {
  try {
    const client = await clientPromise
    const collection = await client.db(DB_NAME).collection('Trees')
    const tree = await collection.find({event: req.params.event})
    const wallet = ethers.utils.verifyWallet(req.params.signature, message);
    //if(wallet === "0x") {throw new UnauthorizedError}
    const [i] = tree
    .entries()
    .find(([_, v]) => v[0] === wallet && v[0] === wallet);

    const proof = tree.getProof(i);
    res.status(200).json({result : proof})
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  } 
}
//proof 
//get tree 
//get proof from signature
const postEvent = async (req, res) => {
  try {
    const client = await clientPromise
    const products = await client.db(DB_NAME).products('Events')
    const wallet = ethers.utils.verifyWallet(req.params.signature, message);
    //if(wallet === ) {throw new UnauthorizedError}
    products.insert({address : req.body.address, event : req.body.event, text : req.body.text});
    res.status(200).json({success: true})
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }  
}

const postToken = async (req, res) => {
  try {
    const client = await clientPromise
    const products = await client.db(DB_NAME).products('Tokens') 
    const wallet = ethers.utils.verifyWallet(req.params.signature, message);
    //if(wallet === ) {throw new UnauthorizedError}
    products.insert({event : req.body.event, token_id : req.params.token_id, name : req.body.name});
    res.status(200).json({success: true})
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  } 
}

const postTree = async (req, res) => {
  try {
    const client = await clientPromise
    const products = await client.db(DB_NAME).products('Tree')
    const wallet = ethers.utils.verifyWallet(req.params.signature, message);
    //if(wallet === ) {throw new UnauthorizedError}
    products.insert({event : req.body.event, tree : JSON.stringify(req.body.tree) });
    res.status(200).json({success: true})
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }
}

export { submitEvent, getEvent, getToken, getAllEvents, getAllTokens, getTreeProof, postEvent, postToken, getTree, postTree };

// export default async function handlerEvents(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const client = await clientPromise
//       const collectionItems = client.db(DB_NAME).collection('Events')
//       //const collectionOrders = client.db(DB_NAME).collection('Orders')
//       const cursor = await collectionItems.find(req.params.id)
//       let events = await cursor.toArray()
//       res.status(200).json({ message: events })
//     }
//     catch {} 
//     }
// //getter address      events
// }

// export default async function handlerEvents(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const client = await clientPromise
//       const collectionItems = client.db(DB_NAME).collection('Tokens')
//       //const collectionOrders = client.db(DB_NAME).collection('Orders')
//       const cursor = await collectionItems.find(req.params.id)
//       let events = await cursor.toArray()
//       res.status(200).json({ message: events })
//     }
//     catch {} 
//     }

// }

// //getter token_id + address   tokens
// TreeWalker.addLeaf(SHA256())