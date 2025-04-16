import { analyzeContractTool } from "./analyzeContract";
import { gerarHashContrato } from "./gerarHashContrato";
import { registerOnChain } from "./registerOnChain";

/**
 * Fluxo completo de análise, geração de hash e registro na blockchain.
 * @param content Texto do contrato a ser analisado e registrado.
 * @returns Resultado da operação com hash e chave pública do registro.
 */
export async function registerContractWorkflow(content: string) {
  // 1. Análise do contrato com a IA
  const analise = await analyzeContractTool.handler({} as any, { content: { text: content } } as any);
  if (!analise) {
    return "Erro: não foi possível analisar o contrato";
  }

  // 2. Gerar o hash do contrato
  const hash = gerarHashContrato(content);

  // 3. Registrar o hash na blockchain via smart contract
  const resultado = await registerOnChain(hash);

  // 4. Retornar resposta consolidada
  return {
    mensagem: "Contrato registrado com sucesso na blockchain!",
    hash,
    registro: resultado
  };
}
