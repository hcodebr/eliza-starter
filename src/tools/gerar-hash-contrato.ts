import { createHash } from "crypto";

/**
 * Gera um hash SHA-256 a partir do conteúdo de um contrato.
 * @param content Conteúdo do contrato em texto.
 * @returns Hash SHA-256 no formato hexadecimal.
 */
export function gerarHashContrato(content: string): string {
  const hash = createHash("sha256");
  hash.update(content);
  return hash.digest("hex");
}


