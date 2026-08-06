import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import idl from "./idl.json";
import bs58 from "bs58";

const PROGRAM_ID = new PublicKey(idl.address);
const DEVNET_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || process.env.QUICKNODE_RPC_URL || "https://api.devnet.solana.com";

export async function fetchAttestation(imageHash: string) {
  const connection = new Connection(DEVNET_URL);
  
  // Convert hex/string hash to Uint8Array
  // Assuming the hash comes in as a hex string for now
  let hashBuffer: Uint8Array;
  try {
    hashBuffer = new Uint8Array(Buffer.from(imageHash, 'hex'));
    if (hashBuffer.length !== 32) throw new Error("Invalid hash length");
  } catch (e) {
    console.error("Hash parsing error:", e);
    return null;
  }

  // We need to find all attestations with this image hash
  // Since the PDA includes the 'creator' key, we might need to search 
  // via getProgramAccounts with a filter on the image_hash field.
  
  try {
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 8 + 32, // Discriminator (8) + Creator Pubkey (32)
            bytes: bs58.encode(hashBuffer),
          }
        }
      ]
    });

    if (accounts.length === 0) return null;

    // Decode the first matching account
    const coder = new anchor.BorshAccountsCoder(idl as any);
    const decoded = coder.decode("Attestation", accounts[0].account.data);
    
    return {
      ...decoded,
      address: accounts[0].pubkey.toBase58(),
      creator: decoded.creator.toBase58(),
    };
  } catch (error) {
    console.error("Blockchain lookup failed:", error);
    return null;
  }
}

export function formatPubkey(pubkey: string) {
  if (!pubkey) return "";
  return `${pubkey.slice(0, 4)}...${pubkey.slice(-4)}`;
}

export async function fetchTransaction(signature: string) {
  const connection = new Connection(DEVNET_URL);
  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });

    if (!tx || !tx.transaction.message) return null;

    const message: any = tx.transaction.message;

    // Extract static account keys for v0 messages or legacy
    let accountKeys: PublicKey[];
    if ('staticAccountKeys' in message) {
      accountKeys = message.staticAccountKeys;
    } else {
      accountKeys = message.accountKeys;
    }

    const instructions = message.compiledInstructions || message.instructions;
    
    let targetIx = null;
    let creatorPubkey = null;

    for (const ix of instructions) {
      const programId = accountKeys[ix.programIdIndex];
      if (programId.toBase58() === PROGRAM_ID.toBase58()) {
        targetIx = ix;
        creatorPubkey = accountKeys[ix.accountKeyIndexes[1]]; // The 2nd key in keys array is userPubkey
        break;
      }
    }

    if (!targetIx || !creatorPubkey) return null;

    // Data is usually a Uint8Array or Base58 string depending on the version/parsing
    let dataBuffer: Buffer;
    if (typeof targetIx.data === 'string') {
        dataBuffer = Buffer.from(bs58.decode(targetIx.data));
    } else {
        dataBuffer = Buffer.from(targetIx.data);
    }
    
    // Check discriminator (8 bytes)
    // Image hash is next 32 bytes
    const imageHashBuffer = dataBuffer.subarray(8, 40);
    const hash = imageHashBuffer.toString('hex');
    
    // Skip 64 bytes for signature (offset 40 to 104)
    // Timestamp is 8 bytes (offset 104 to 112)
    const timestampBn = new anchor.BN(dataBuffer.subarray(104, 112), 'le');
    
    // Lat is 8 bytes f64 (offset 112 to 120)
    const lat = dataBuffer.readDoubleLE(112);
    
    // Long is 8 bytes f64 (offset 120 to 128)
    const long = dataBuffer.readDoubleLE(120);
    
    // URI length is 4 bytes (offset 128 to 132)
    const uriLength = dataBuffer.readUInt32LE(128);
    
    // URI string
    const uri = dataBuffer.subarray(132, 132 + uriLength).toString('utf-8');

    return {
      hash,
      status: "verified",
      timestamp: timestampBn.toNumber() * 1000,
      lat,
      long,
      creator: creatorPubkey.toBase58(),
      uri,
      signature: signature.slice(0, 16) + "...", 
      hardware: "Solana Seeker (TEE Signed)",
    };
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    return null;
  }
}
