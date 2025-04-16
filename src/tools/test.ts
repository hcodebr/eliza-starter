import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { registerContractWorkflow } from "./registerContract";
import { validarContrato } from "./validarContrato";

const contrato = `
Contrato de Prestação de Serviços
Entre as partes Fulano de Tal (contratante) e Beltrano Ltda (contratada)
Objeto: Desenvolvimento de Software sob demanda
Início: 15/04/2025
Cláusulas: ...
`;

// Fluxo principal
async function testar() {
  // Configurar o provider do Anchor
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Carregar o programa
  const program = new Program(
    {
      version: "0.1.0",
      name: "lexachain_contract",
      instructions: [
        {
          name: "registrar_contrato",
          accounts: [
            { name: "registro", isMut: true, isSigner: true },
            { name: "autor", isMut: true, isSigner: true },
            { name: "systemProgram", isMut: false, isSigner: false }
          ],
          args: [
            { name: "hash", type: "string" }
          ]
        }
      ],
      accounts: [
        {
          name: "RegistroContrato",
          type: {
            kind: "struct",
            fields: [
              { name: "hash", type: "string" },
              { name: "autor", type: "publicKey" },
              { name: "timestamp", type: "i64" }
            ]
          }
        }
      ]
    },
    new anchor.web3.PublicKey("14mNAGxBkZtxCF1YyB2R8TtarPyKU5HxrufoLzXBedjx"),
    provider
  );

  // Registro do contrato
  const resultado = await registerContractWorkflow(contrato);
  console.log("Resultado do registro:", resultado);

  // Validação do contrato com o hash retornado
  if (typeof resultado === 'string') {
    console.log("Erro no registro:", resultado);
    return;
  }
  const validacao = await validarContrato(resultado.hash, contrato);
  console.log("Validação do contrato:", validacao);
}

testar().catch(console.error);
