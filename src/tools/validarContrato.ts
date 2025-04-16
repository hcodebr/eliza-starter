import { gerarHashContrato } from "./gerarHashContrato";

/**
 * Valida se o conteúdo fornecido gera o mesmo hash original.
 * @param hashOriginal Hash esperado (registrado anteriormente na blockchain)
 * @param novoConteudo Novo conteúdo do contrato a ser validado
 * @returns Booleano indicando validade e o hash gerado para comparação
 */
export async function validarContrato(hashOriginal: string, novoConteudo: string) {
  const novoHash = gerarHashContrato(novoConteudo);
  return {
    valido: hashOriginal === novoHash,
    hashGerado: novoHash
  };
}

const hashOriginal = "1234567890";
const novoConteudo = "1234567890";
const resultado = await validarContrato(hashOriginal, novoConteudo);
console.log(resultado);
