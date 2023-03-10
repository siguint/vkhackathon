import { clientPromise } from "../utils/mongodb";
import { ethers } from "ethers"
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

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
    res.status(200).json({ success: true, result: token_id });
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
    res.status(200).json({ success: true, result: events })
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
    res.status(200).json({ success: true, result: tokens })
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  }   
};

//all events
const getTreeProof = async (req, res) => {
  try {
    const client = await clientPromise
    const collection = await client.db(DB_NAME).collection('Trees')
    const tree = await collection.findOne({event: req.params.event})
    const true_tree = StandardMerkleTree.load(tree);
    const wallet = ethers.utils.verifyMessage(message, req.params.signature)
    //if(wallet === "0x") {throw new UnauthorizedError}
    const [i] = true_tree
    .entries()
    .find(([_, v]) => v[0] === wallet && v[0] === wallet);
    
    const proof = true_tree.getProof(i);
    res.status(200).json({ success: true, result : proof})
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
    const wallet = ethers.utils.verifyMessage(message, req.params.signature)
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
    const wallet = ethers.utils.verifyMessage(message, req.params.signature)
    //if(wallet === ) {throw new UnauthorizedError}
    products.insert({event : req.body.event, token_id : req.params.token_id, name : req.body.name});
    res.status(200).json({success: true})
  } catch (e) {
    res.status(400).json({ success: false, result: e.message });
  } 
}

export { submitEvent, getEvent, getToken, getAllEvents, getAllTokens, getTreeProof, postEvent, postToken };