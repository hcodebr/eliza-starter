import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import wallet from "./wallet.json";

export async function registerOnChain(hash: string) {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const walletKeypair = Keypair.fromSecretKey(Uint8Array.from(wallet));
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(walletKeypair), {});
  anchor.setProvider(provider);

  const programId = new anchor.web3.PublicKey("14mNAGxBkZtxCF1YyB2R8TtarPyKU5HxrufoLzXBedjx");
  const program = anchor.workspace.LexachainContract as anchor.Program;

  const registro = Keypair.generate();

  await program.methods.registrarContrato(hash)
    .accounts({
      registro: registro.publicKey,
      autor: walletKeypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([registro])
    .rpc();

  return registro.publicKey.toBase58();
}
