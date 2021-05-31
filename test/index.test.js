import path from "path";
import * as types from "@onflow/types";
import {deployContractByName, getTransactionCode, init, sendTransaction} from "flow-js-testing/dist";
import {executeScript, getAccountAddress, getContractAddress, getScriptCode} from "flow-js-testing";

const basePath = path.resolve(__dirname, "../cadence");

beforeAll(() => {
    init(basePath);
});

const getTokensByAddress = async (type, address) => {
    const name = "token_ids_by_address";

    // Generate addressMap from import statements
    const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

    const addressMap = {
        TatumMultiNFT,
    };

    let code = await getScriptCode({
        name,
        addressMap,
    });

    // Define arguments
    const args = [
        [address, types.Address],
        [type, types.String],
    ];

    return await executeScript({
        code,
        args,
    });
}

const getMetadata = async (type, id, address) => {
    const name = "metadata";

    // Generate addressMap from import statements
    const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

    const addressMap = {
        TatumMultiNFT,
    };

    let code = await getScriptCode({
        name,
        addressMap,
    });

    // Define arguments
    const args = [
        [address, types.Address],
        [id, types.UInt64],
        [type, types.String],
    ];

    return await executeScript({
        code,
        args,
    });
}

describe("Deployment", () => {

    test("Create Accounts", async () => {
        // Playground project support 4 accounts, but nothing stops you from creating more by following the example laid out below
        const Alice = await getAccountAddress("Alice");
        const Bob = await getAccountAddress("Bob");
        const Charlie = await getAccountAddress("Charlie");
        const Dave = await getAccountAddress("Dave");

        console.log(
            "Four Playground accounts were created with following addresses"
        );
        console.log("Alice:", Alice);
        console.log("Bob:", Bob);
        console.log("Charlie:", Charlie);
        console.log("Dave:", Dave);
    });

    test("Deploy NonFungibleToken contract", async () => {
        const name = "NonFungibleToken";
        const to = await getAccountAddress("Dave");

        let result;
        try {
            result = await deployContractByName({
                name,
                to,
            });
        } catch (e) {
            console.log(e);
        }

        expect(result.errorMessage).toBe("");
    });

    test("Deploy TatumMultiNFT contract", async () => {
        const name = "TatumMultiNFT";
        const to = await getAccountAddress("Alice");

        // Generate addressMap from import statements
        const NonFungibleToken = await getContractAddress("NonFungibleToken");

        const addressMap = {
            NonFungibleToken,
        };
        let result;
        try {
            result = await deployContractByName({
                name,
                to,
                addressMap
            });
        } catch (e) {
            console.log(e);
        }

        expect(result.errorMessage).toBe("");
    });

});

describe("Transactions", () => {

    // Account set up
    test("test transaction template setup account", async () => {
        const name = "setup_account";

        // Import participating accounts
        const accounts = await Promise.all([getAccountAddress("Alice"),
            getAccountAddress("Bob"),
            getAccountAddress("Charlie"),
            getAccountAddress("Dave")]);

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });
        for (const account of accounts) {
            // Set transaction signers
            const signers = [account];

            let txResult;
            try {
                txResult = await sendTransaction({
                    code,
                    signers,
                });
            } catch (e) {
                console.log(e);
            }

            expect(txResult.status).toBe(4);
        }
    });

    // Add minter tests
    test("test transaction add minter role to Bob for token type TOKEN_1", async () => {
        const name = "add_minter";

        // Import participating accounts
        const Alice = await getAccountAddress("Alice");
        const Bob = await getAccountAddress("Bob");

        // Set transaction signers
        const signers = [Alice, Bob];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        // Define arguments
        const args = [
            ['TOKEN_1', types.String],
        ];

        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                args,
                signers,
            });
        } catch (e) {
            console.log(e);
            fail(e);
        }

        expect(txResult.status).toBe(4);
    });
    test("test transaction add minter role to Charlie for token type TOKEN_2", async () => {
        const name = "add_minter";

        // Import participating accounts
        const [Alice, Charlie] = await Promise.all([getAccountAddress("Alice"), getAccountAddress("Charlie")]);

        // Set transaction signers
        const signers = [Alice, Charlie];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        // Define arguments
        const args = [
            ['TOKEN_2', types.String],
        ];

        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                args,
                signers,
            });
        } catch (e) {
            console.log(e);
            fail(e);
        }

        expect(txResult.status).toBe(4);
    });
    test("test FAIL transaction add minter role to Bob from not allowed admin for token type TOKEN_1", async () => {
        const name = "add_minter";

        // Import participating accounts
        const [Bob, Dave] = await Promise.all([getAccountAddress("Bob"), getAccountAddress("Dave")]);

        // Set transaction signers
        const signers = [Dave, Bob];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        // Define arguments
        const args = [
            ['TOKEN_1', types.String],
        ];

        try {
            await sendTransaction({
                code,
                args,
                signers,
            });
            fail('should fail - signer is not default minter');
        } catch (e) {
            console.log(e);
            expect(e).toContain("Could not borrow a reference to the NFT minter");
        }
    });
    test("test FAIL transaction add minter role to noone for token type TOKEN_1", async () => {
        const name = "add_minter";

        // Import participating accounts
        const Alice = await getAccountAddress("Alice");

        // Set transaction signers
        const signers = [Alice];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        // Define arguments
        const args = [
            ['TOKEN_1', types.String],
        ];

        try {
            await sendTransaction({
                code,
                args,
                signers,
            });
            fail('should fail - signer is not default minter');
        } catch (e) {
            console.log(e);
            expect(e).toContain("error: authorizer count mismatch for transaction: expected 2, got 1");
        }
    });

    // Mint tokens
    test("test transaction template mint from minter BOB to Dave TOKEN_1", async () => {
        const name = "mint";

        // Import participating accounts
        const [Bob, Dave] = await Promise.all([getAccountAddress("Bob"), getAccountAddress("Dave")]);

        // Set transaction signers
        const signers = [Bob];

        // Define arguments
        const args = [
            [Dave, types.Address],
            ["random url", types.String],
            ["TOKEN_1", types.String],
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                args,
                signers,
            });
        } catch (e) {
            console.log(e);
            fail(e);
        }
        expect(txResult.status).toBe(4);
        let event = txResult.events.find(e => e.type.includes('.Minted'));
        expect(event).toBeDefined()
        expect(event?.data).toStrictEqual({
            id: 0,
            type: 'TOKEN_1',
            to: Dave
        });
        expect([0]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect("random url").toBe(await getMetadata('TOKEN_1', 0, Dave));
    });
    test("test transaction template mint from minter Charlie to Alice TOKEN_2", async () => {
        const name = "mint";

        // Import participating accounts
        const [Charlie, Alice] = await Promise.all([getAccountAddress("Charlie"), getAccountAddress("Alice")]);

        // Set transaction signers
        const signers = [Charlie];

        // Define arguments
        const args = [
            [Alice, types.Address],
            ["random url", types.String],
            ["TOKEN_2", types.String],
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                args,
                signers,
            });
        } catch (e) {
            console.log(e);
            fail(e);
        }

        expect(txResult.status).toBe(4);
        let event = txResult.events.find(e => e.type.includes('.Minted'));
        expect(event).toBeDefined()
        expect(event?.data).toStrictEqual({
            id: 1,
            type: 'TOKEN_2',
            to: Alice
        });
        expect([1]).toStrictEqual(await getTokensByAddress('TOKEN_2', Alice));
        expect("random url").toBe(await getMetadata('TOKEN_2', 1, Alice));
    });
    test("test FAIL transaction template mint from minter Charlie to Alice unknown TOKEN_3", async () => {
        const name = "mint";

        // Import participating accounts
        const [Charlie, Alice, Dave] = await Promise.all([getAccountAddress("Charlie"), getAccountAddress("Alice")]);

        // Set transaction signers
        const signers = [Charlie];

        // Define arguments
        const args = [
            [Alice, types.Address],
            ["random url", types.String],
            ["TOKEN_3", types.String],
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        try {
            await sendTransaction({
                code,
                args,
                signers,
            });
            fail('Wrong minter fro token type, this should not pass.')
        } catch (e) {
            console.log(e);
            expect(e).toContain('Unable to mint token for type, where this account is not a minter');
        }
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_3', Alice));
    });
    test("test FAIL transaction template mint from minter Charlie to Alice wrong TOKEN_1", async () => {
        const name = "mint";

        // Import participating accounts
        const [Charlie, Alice] = await Promise.all([getAccountAddress("Charlie"), getAccountAddress("Alice")]);

        // Set transaction signers
        const signers = [Charlie];

        // Define arguments
        const args = [
            [Alice, types.Address],
            ["random url", types.String],
            ["TOKEN_1", types.String],
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        try {
            await sendTransaction({
                code,
                args,
                signers,
            });
            fail('Wrong minter fro token type, this should not pass.')
        } catch (e) {
            console.log(e);
            expect(e).toContain('Unable to mint token for type, where this account is not a minter');
        }
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
    });

    // Transfer tokens
    test("test transaction template transfer from Dave to Bob TOKEN_1 - ID 0", async () => {
        const name = "transfer";

        // Import participating accounts
        const [Bob, Dave, Alice, Charlie] = await Promise.all([getAccountAddress("Bob"), getAccountAddress("Dave"),
            getAccountAddress("Alice"), getAccountAddress("Charlie")]);

        // Set transaction signers
        const signers = [Dave];

        // Define arguments
        const args = [
            [Bob, types.Address],
            [0, types.UInt64],
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Bob));
        expect([0]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Charlie));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_2', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_2', Dave));
        expect([1]).toStrictEqual(await getTokensByAddress('TOKEN_2', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_2', Charlie));
        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                args,
                signers,
            });
        } catch (e) {
            console.log(e);
            fail(e);
        }

        expect(txResult.status).toBe(4);
        expect(txResult.events.length).toBe(2);
        expect(txResult.events[0]?.type).toBe(`A.${TatumMultiNFT.slice(2)}.TatumMultiNFT.Withdraw`);
        expect(txResult.events[0]?.data).toStrictEqual({
            id: 0,
            from: Dave
        });
        expect(txResult.events[1]?.type).toBe(`A.${TatumMultiNFT.slice(2)}.TatumMultiNFT.Deposit`);
        expect(txResult.events[1]?.data).toStrictEqual({
            id: 0,
            to: Bob
        });
        expect([0]).toStrictEqual(await getTokensByAddress('TOKEN_1', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Charlie));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_2', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_2', Dave));
        expect([1]).toStrictEqual(await getTokensByAddress('TOKEN_2', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_2', Charlie));
    });
    test("test FAIL transaction template transfer from Dave to Bob non-existing TOKEN_1 - ID 100", async () => {
        const name = "transfer";

        // Import participating accounts
        const [Bob, Dave, Alice, Charlie] = await Promise.all([getAccountAddress("Bob"), getAccountAddress("Dave"),
            getAccountAddress("Alice"), getAccountAddress("Charlie")]);

        // Set transaction signers
        const signers = [Dave];

        // Define arguments
        const args = [
            [Bob, types.Address],
            [100, types.UInt64],
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        expect([0]).toStrictEqual(await getTokensByAddress('TOKEN_1', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Charlie));
        try {
            await sendTransaction({
                code,
                args,
                signers,
            });
            fail('should fail - no such NFT');
        } catch (e) {
            console.log(e);
            expect(e).toContain("missing NFT");
        }
        expect([0]).toStrictEqual(await getTokensByAddress('TOKEN_1', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Charlie));
    });

    // Burn tokens
    test("test transaction template burn from Bob TOKEN_1 - ID 0", async () => {
        const name = "burn";

        // Import participating accounts
        const [Bob, Dave, Alice, Charlie] = await Promise.all([getAccountAddress("Bob"), getAccountAddress("Dave"),
            getAccountAddress("Alice"), getAccountAddress("Charlie")]);

        // Set transaction signers
        const signers = [Bob];

        // Define arguments
        const args = [
            [0, types.UInt64],
            ['TOKEN_1', types.String]
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        expect([0]).toStrictEqual(await getTokensByAddress('TOKEN_1', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Charlie));
        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                args,
                signers,
            });
        } catch (e) {
            console.log(e);
            fail(e);
        }

        expect(txResult.status).toBe(4);
        expect(txResult.events.length).toBe(1);
        expect(txResult.events[0]?.type).toBe(`A.${TatumMultiNFT.slice(2)}.TatumMultiNFT.Withdraw`);
        expect(txResult.events[0]?.data).toStrictEqual({
            id: 0,
            from: Bob
        });
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Bob));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Dave));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Alice));
        expect([]).toStrictEqual(await getTokensByAddress('TOKEN_1', Charlie));
    });
    test("test FAIL transaction template burn from Dave wrong TOKEN_2 - ID 0", async () => {
        const name = "burn";

        // Import participating accounts
        const [Dave] = await Promise.all([getAccountAddress("Dave")]);

        // Set transaction signers
        const signers = [Dave];

        // Define arguments
        const args = [
            [0, types.UInt64],
            ['TOKEN_2', types.String]
        ];

        // Generate addressMap from import statements
        const TatumMultiNFT = await getContractAddress("TatumMultiNFT");

        const addressMap = {
            TatumMultiNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        try {
            await sendTransaction({
                code,
                args,
                signers,
            });
            fail('should fail - no such NFT');
        } catch (e) {
            console.log(e);
            expect(e).toContain("No such token type");
        }
    });
});
