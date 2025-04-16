import { Character, defaultCharacter, ModelProviderName } from "@elizaos/core";

export const character: Character = {
  ...defaultCharacter,
  modelProvider: ModelProviderName.GOOGLE,
  settings: {
    secrets: {},
  },
};
