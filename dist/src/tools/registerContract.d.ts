/**
 * Fluxo completo de análise, geração de hash e registro na blockchain.
 * @param content Texto do contrato a ser analisado e registrado.
 * @returns Resultado da operação com hash e chave pública do registro.
 */
export declare function registerContractWorkflow(content: string): Promise<"Erro: não foi possível analisar o contrato" | {
    mensagem: string;
    hash: string;
    registro: string;
}>;
