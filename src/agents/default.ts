import { ModelProviderName } from "@elizaos/core";
import { initializeDbCache } from "../cache";
import { character } from "../character";
import { getTokenForProvider } from "../config";
import { initializeDatabase } from "../database";
import { createAgent } from "../index";

character.modelProvider = ModelProviderName.GOOGLE;

const db = initializeDatabase("./data");
const cache = initializeDbCache(character, db);
const token = getTokenForProvider(character.modelProvider, character);

export const agent = createAgent(character, db, cache, token);
