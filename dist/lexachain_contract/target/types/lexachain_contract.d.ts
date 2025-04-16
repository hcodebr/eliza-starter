/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lexachain_contract.json`.
 */
export type LexachainContract = {
    "address": "79C5NHh9Z6isY2sThafzcJ7QmBffYon2NcRDbz3kfLTh";
    "metadata": {
        "name": "lexachainContract";
        "version": "0.1.0";
        "spec": "0.1.0";
        "description": "Created with Anchor";
    };
    "instructions": [
        {
            "name": "registrarContrato";
            "discriminator": [
                50,
                93,
                8,
                77,
                37,
                24,
                140,
                45
            ];
            "accounts": [
                {
                    "name": "registro";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "autor";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "hash";
                    "type": "string";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "registroContrato";
            "discriminator": [
                142,
                24,
                119,
                71,
                88,
                94,
                209,
                60
            ];
        }
    ];
    "types": [
        {
            "name": "registroContrato";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "hash";
                        "type": "string";
                    },
                    {
                        "name": "autor";
                        "type": "pubkey";
                    },
                    {
                        "name": "timestamp";
                        "type": "i64";
                    }
                ];
            };
        }
    ];
};
