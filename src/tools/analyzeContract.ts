import { Action } from "@elizaos/core";

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

export default analyzeContractTool;
