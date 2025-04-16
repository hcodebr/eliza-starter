import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import wallet from "./wallet.json";

export async function registerOnChain(hash: string): Promise<string> {

  console.log('Registering on chain', { hash })

  // Initialize connection and provider
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const walletKeypair = Keypair.fromSecretKey(Uint8Array.from(wallet));
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(walletKeypair), {});
  anchor.setProvider(provider);

  const program = anchor.workspace.lexachain_contract as anchor.Program;
  const registro = Keypair.generate();



  // Call the program method
  await program.methods
    .registrarContrato(hash)
    .accounts({
      registro: registro.publicKey,
      autor: walletKeypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([registro])
    .rpc();

  // Return the public key as a string
  return registro.publicKey.toBase58();
}
