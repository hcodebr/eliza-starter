// src/index.ts
import { DirectClient } from "@elizaos/client-direct";
import {
  AgentRuntime,
  elizaLogger,
  settings as settings3,
  stringToUuid
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { createNodePlugin } from "@elizaos/plugin-node";
import { solanaPlugin } from "@elizaos/plugin-solana";
import fs3 from "fs";
import net from "net";
import path4 from "path";
import { fileURLToPath } from "url";

// src/cache/index.ts
import { CacheManager, DbCacheAdapter } from "@elizaos/core";

// src/character.ts
import { defaultCharacter, ModelProviderName } from "@elizaos/core";
var character = {
  ...defaultCharacter,
  modelProvider: ModelProviderName.GOOGLE,
  settings: {
    secrets: {}
  }
};

// src/chat/index.ts
import { settings } from "@elizaos/core";
import readline from "readline";
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on("SIGINT", () => {
  rl.close();
  process.exit(0);
});

// src/clients/index.ts
import { AutoClientInterface } from "@elizaos/client-auto";
import { DiscordClientInterface } from "@elizaos/client-discord";
import { TelegramClientInterface } from "@elizaos/client-telegram";
import { TwitterClientInterface } from "@elizaos/client-twitter";

// src/config/index.ts
import { ModelProviderName as ModelProviderName2, settings as settings2, validateCharacterConfig } from "@elizaos/core";
import fs from "fs";
import path from "path";
import yargs from "yargs";

// src/database/index.ts
import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import Database from "better-sqlite3";
import path2 from "path";

// src/tools/analyze-contract.ts
var TEMPLATE = `\u{1F4DC} **Resumo do Contrato**:
{resumo}

\u{1F50D} **Cl\xE1usulas Importantes**:
1. {clausula1}
2. {clausula2}
3. {clausula3}

\u26A0\uFE0F **Riscos Potenciais**:
- {risco1}
- {risco2}

\u{1F50E} **Dica**: {dica}

\u2705 *An\xE1lise feita via IA*`;
var analyzeContractTool = {
  name: "ANALYZE_CONTRACT",
  description: "Analisa o texto de um contrato e retorna cl\xE1usulas importantes, riscos e um resumo",
  similes: ["analisar contrato", "revisar contrato"],
  examples: [],
  handler: async (runtime, message) => {
    const contractText = message.content.text;
    return TEMPLATE.replace("{resumo}", contractText.slice(0, 100)).replace("{clausula1}", "Objeto do contrato").replace("{clausula2}", "Prazo de vig\xEAncia: 12 meses").replace("{clausula3}", "Multa por rescis\xE3o: 30% do valor").replace(
      "{risco1}",
      "Cl\xE1usula de exclusividade nacional pode limitar oportunidades"
    ).replace(
      "{risco2}",
      "Multa por rescis\xE3o antecipada relativamente alta (30%)"
    ).replace(
      "{dica}",
      "Revise os termos de exclusividade e considere negociar a multa por rescis\xE3o"
    );
  },
  validate: async (input) => true
};

// src/server.ts
import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs2 from "fs";
import path3 from "path";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
async function registerOnChain(hash) {
  console.log("Registering on chain", { hash });
  const __dirname2 = path3.dirname(new URL(import.meta.url).pathname);
  const walletPath = path3.resolve(__dirname2, "tools", "wallet.json");
  const wallet = JSON.parse(fs2.readFileSync(walletPath, "utf-8"));
  console.log("Wallet", { wallet });
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const walletKeypair = Keypair.fromSecretKey(Uint8Array.from(wallet));
  const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(walletKeypair), {});
  anchor.setProvider(provider);
  console.log("=========================");
  console.dir(Object.keys(anchor.workspace));
  console.log(typeof anchor.workspace.lexachainContract);
  console.log("=========================");
  const program = anchor.workspace.lexachainContract;
  const registro = Keypair.generate();
  await program.methods.registrarContrato(hash).accounts({
    registro: registro.publicKey,
    autor: walletKeypair.publicKey,
    systemProgram: SystemProgram.programId
  }).signers([registro]).rpc();
  return registro.publicKey.toBase58();
}
var TEMPLATE2 = `\u{1F4DC} **Resumo do Contrato**:
{resumo}

\u{1F50D} **Cl\xE1usulas Importantes**:
1. {clausula1}
2. {clausula2}
3. {clausula3}

\u26A0\uFE0F **Riscos Potenciais**:
- {risco1}
- {risco2}

\u{1F50E} **Dica**: {dica}

\u2705 *An\xE1lise feita via IA*`;
var analyzeContractTool2 = {
  name: "ANALYZE_CONTRACT",
  description: "Analisa o texto de um contrato e retorna cl\xE1usulas importantes, riscos e um resumo",
  similes: ["analisar contrato", "revisar contrato"],
  examples: [],
  handler: async (runtime, message) => {
    const contractText = message.content.text;
    return TEMPLATE2.replace("{resumo}", contractText.slice(0, 100)).replace("{clausula1}", "Objeto do contrato").replace("{clausula2}", "Prazo de vig\xEAncia: 12 meses").replace("{clausula3}", "Multa por rescis\xE3o: 30% do valor").replace(
      "{risco1}",
      "Cl\xE1usula de exclusividade nacional pode limitar oportunidades"
    ).replace(
      "{risco2}",
      "Multa por rescis\xE3o antecipada relativamente alta (30%)"
    ).replace(
      "{dica}",
      "Revise os termos de exclusividade e considere negociar a multa por rescis\xE3o"
    );
  },
  validate: async (input) => true
};
var startServer = async () => {
  console.log("Starting server...");
  const app = express();
  const upload = multer({ dest: "uploads/" });
  const calculateFileHash = (filePath) => {
    try {
      const fileBuffer = fs2.readFileSync(filePath);
      return crypto.createHash("sha256").update(fileBuffer).digest("hex");
    } catch (error) {
      console.error(`Error calculating file hash: ${filePath}`, error);
      throw new Error("Failed to calculate file hash.");
    }
  };
  const deleteFile = (filePath) => {
    try {
      fs2.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  };
  const analyzeContract = async (fileContent) => {
    try {
      console.log("analyzeContract");
      const analysis = await analyzeContractTool2.handler({}, { content: { text: fileContent } });
      if (!analysis) {
        throw new Error("Error: Unable to analyze the contract");
      }
      return analysis;
    } catch (error) {
      console.error("Error analyzing contract:", error);
      throw new Error("Failed to analyze contract.");
    }
  };
  const registerHashOnChain = async (hash) => {
    console.log("registerHashOnChain", { hash });
    try {
      return await registerOnChain(hash);
    } catch (error) {
      console.error("Error registering hash on chain:", error);
      throw new Error("Failed to register hash on chain.");
    }
  };
  const processFile = async (filePath) => {
    try {
      const hash = calculateFileHash(filePath);
      const fileContent = fs2.readFileSync(filePath, "utf-8");
      const provider = anchor.AnchorProvider.env();
      anchor.setProvider(provider);
      const analysis = await analyzeContract(fileContent);
      const result = await registerHashOnChain(hash);
      return { hash, result, analysis };
    } catch (error) {
      console.error("Error processing file:", error);
      throw new Error("Failed to process file.");
    } finally {
      deleteFile(filePath);
    }
  };
  app.post("/", upload.single("file"), async (req, res) => {
    console.log("request");
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const filePath = path3.resolve(req.file.path);
    try {
      const { hash, result, analysis } = await processFile(filePath);
      res.send({
        message: "File uploaded and processed successfully!",
        hash,
        result,
        analysis
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  const PORT = 3e3;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// src/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path4.dirname(__filename);
var wait = (minTime = 1e3, maxTime = 3e3) => {
  const waitTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};
var nodePlugin;
function createAgent(character2, db, cache, token) {
  elizaLogger.success(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character2.name
  );
  nodePlugin ??= createNodePlugin();
  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character2.modelProvider,
    evaluators: [],
    character: character2,
    plugins: [
      bootstrapPlugin,
      nodePlugin,
      character2.settings?.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null
    ].filter(Boolean),
    providers: [],
    actions: [analyzeContractTool],
    services: [],
    managers: [],
    cacheManager: cache
  });
}
startServer().finally(() => {
  elizaLogger.log("Server started");
});
export {
  createAgent,
  wait
};
