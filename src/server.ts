import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Action } from '@elizaos/core';
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

async function registerOnChain(hash: string): Promise<string> {

  console.log('Registering on chain', { hash })

  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const walletPath = path.resolve(__dirname, 'tools', 'wallet.json');
  const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));

  console.log('Wallet', { wallet })

  // Initialize connection and provider
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const walletKeypair = Keypair.fromSecretKey(Uint8Array.from(wallet));
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(walletKeypair), {});
  anchor.setProvider(provider);

  console.log('=========================')
  console.dir(Object.keys(anchor.workspace))
  console.log(typeof anchor.workspace.lexachainContract)
  console.log('=========================')

  const program = anchor.workspace.lexachainContract as anchor.Program;
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


const TEMPLATE = `📜 **Resumo do Contrato**:
{resumo}

🔍 **Cláusulas Importantes**:
1. {clausula1}
2. {clausula2}
3. {clausula3}

⚠️ **Riscos Potenciais**:
- {risco1}
- {risco2}

🔎 **Dica**: {dica}

✅ *Análise feita via IA*`;

export const analyzeContractTool: Action = {
  name: "ANALYZE_CONTRACT",
  description:
    "Analisa o texto de um contrato e retorna cláusulas importantes, riscos e um resumo",
  similes: ["analisar contrato", "revisar contrato"],
  examples: [],
  handler: async (runtime, message) => {
    const contractText = message.content.text;

    return TEMPLATE.replace("{resumo}", contractText.slice(0, 100))
      .replace("{clausula1}", "Objeto do contrato")
      .replace("{clausula2}", "Prazo de vigência: 12 meses")
      .replace("{clausula3}", "Multa por rescisão: 30% do valor")
      .replace(
        "{risco1}",
        "Cláusula de exclusividade nacional pode limitar oportunidades"
      )
      .replace(
        "{risco2}",
        "Multa por rescisão antecipada relativamente alta (30%)"
      )
      .replace(
        "{dica}",
        "Revise os termos de exclusividade e considere negociar a multa por rescisão"
      );
  },
  validate: async (input) => true,
};

export const startServer = async () => {

    console.log('Starting server...');

    const app = express();
    const upload = multer({ dest: 'uploads/' });

    const calculateFileHash = (filePath: string): string => {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            return crypto.createHash('sha256').update(fileBuffer).digest('hex');
        } catch (error) {
            console.error(`Error calculating file hash: ${filePath}`, error);
            throw new Error('Failed to calculate file hash.');
        }
    };

    const deleteFile = (filePath: string): void => {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error deleting file: ${filePath}`, error);
        }
    };

    const analyzeContract = async (fileContent: string): Promise<any> => {
        try {
            console.log('analyzeContract')
            const analysis = await analyzeContractTool.handler({} as any, { content: { text: fileContent } } as any);
            if (!analysis) {
                throw new Error("Error: Unable to analyze the contract");
            }
            return analysis;
            
        } catch (error) {
            console.error('Error analyzing contract:', error);
            throw new Error('Failed to analyze contract.');
        }
    };

    const registerHashOnChain = async (hash: string): Promise<any> => {
        console.log('registerHashOnChain', { hash })
        try {
            return await registerOnChain(hash);
        } catch (error) {
            console.error('Error registering hash on chain:', error);
            throw new Error('Failed to register hash on chain.');
        }
    };

    const processFile = async (filePath: string): Promise<{ hash: string; result: any; analysis:any }> => {
        try {
            const hash = calculateFileHash(filePath);
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            const provider = anchor.AnchorProvider.env();

            anchor.setProvider(provider);

            const analysis = await analyzeContract(fileContent);
            const result = await registerHashOnChain(hash);

            return { hash, result, analysis };
        } catch (error) {
            console.error('Error processing file:', error);
            throw new Error('Failed to process file.');
        } finally {
            deleteFile(filePath);
        }
    };

    app.post('/', upload.single('file'), async (req: express.Request, res: express.Response) => {

        console.log('request')

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.resolve(req.file.path);

        try {

            const { hash, result, analysis } = await processFile(filePath);

            res.send({
                message: 'File uploaded and processed successfully!',
                hash,
                result,
                analysis
            });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

}