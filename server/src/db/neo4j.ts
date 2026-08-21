//connect Node.js to CognoDB

import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error("CognoDB configuration is missing");
}

export const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
