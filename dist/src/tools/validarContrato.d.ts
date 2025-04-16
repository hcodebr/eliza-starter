/**
 * Valida se o conteúdo fornecido gera o mesmo hash original.
 * @param hashOriginal Hash esperado (registrado anteriormente na blockchain)
 * @param novoConteudo Novo conteúdo do contrato a ser validado
 * @returns Booleano indicando validade e o hash gerado para comparação
 */
export declare function validarContrato(hashOriginal: string, novoConteudo: string): Promise<{
    valido: boolean;
    hashGerado: string;
}>;
