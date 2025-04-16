import { gerarHashContrato } from "./gerar-hash-contrato";

/**
 * Valida se o conteúdo fornecido gera o mesmo hash original.
 * @param hashOriginal Hash esperado (registrado anteriormente na blockchain)
 * @param novoConteudo Novo conteúdo do contrato a ser validado
 * @returns Objeto contendo a validade e o hash gerado para comparação
 */
export async function validarContrato(hashOriginal: string, novoConteudo: string) {
  const hashGerado = gerarHashContrato(novoConteudo);
  const valido = hashOriginal === hashGerado;

  return { valido, hashGerado };
}
