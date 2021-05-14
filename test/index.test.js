import path from "path";
import * as types from "@onflow/types";
import {deployContractByName, getTransactionCode, init, sendTransaction} from "flow-js-testing/dist";
import {executeScript, getAccountAddress, getContractAddress, getScriptCode} from "flow-js-testing";

const basePath = path.resolve(__dirname, "../cadence");

beforeAll(() => {
    init(basePath);
});

describe("Replicate Playground Accounts", () => {
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
});

describe("Deployment", () => {
    test("Deploy  contract", async () => {
        const name = "NonFungibleToken";
        const to = await getAccountAddress("Alice");

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

    test("Deploy  contract", async () => {
        const name = "TatumNFT";
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
                addressMap,
            });
        } catch (e) {
            console.log(e);
        }

        expect(result.errorMessage).toBe("");
    });

});

describe("Transactions", () => {
    test("test transaction template setup account", async () => {
        const name = "setup account";

        // Import participating accounts
        const Alice = await getAccountAddress("Alice");

        // Set transaction signers
        const signers = [Alice];

        // Generate addressMap from import statements
        const NonFungibleToken = await getContractAddress("NonFungibleToken");
        const TatumNFT = await getContractAddress("TatumNFT");

        const addressMap = {
            NonFungibleToken,
            TatumNFT,
        };

        let code = await getTransactionCode({
            name,
            addressMap,
        });

        let txResult;
        try {
            txResult = await sendTransaction({
                code,
                signers,
            });
        } catch (e) {
            console.log(e);
        }

        expect(txResult.errorMessage).toBe("");
    });

    test("test transaction template mint", async () => {
        const name = "mint";

        // Import participating accounts
        const Alice = await getAccountAddress("Alice");

        // Set transaction signers
        const signers = [Alice];

        // Define arguments
        const args = [
            [Alice, types.Address],
            [64, types.UInt64],
            ["random url", types.String],
        ];

        // Generate addressMap from import statements
        const NonFungibleToken = await getContractAddress("NonFungibleToken");
        const TatumNFT = await getContractAddress("TatumNFT");

        const addressMap = {
            NonFungibleToken,
            TatumNFT,
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
        }

        expect(txResult.errorMessage).toBe("");
    });

    test("test transaction template transfer", async () => {
        const name = "transfer";

        // Import participating accounts
        const Alice = await getAccountAddress("Alice");

        // Set transaction signers
        const signers = [Alice];

        // Define arguments
        const args = [
            [Alice, types.Address],
            [64, types.UInt64],
        ];

        // Generate addressMap from import statements
        const NonFungibleToken = await getContractAddress("NonFungibleToken");
        const TatumNFT = await getContractAddress("TatumNFT");

        const addressMap = {
            NonFungibleToken,
            TatumNFT,
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
        }

        expect(txResult.errorMessage).toBe("");
    });
});

describe("Scripts", () => {
    test("test script template metadata", async () => {
        const name = "metadata";

        const Alice = await getAccountAddress("Alice");

        // Generate addressMap from import statements
        const NonFungibleToken = await getContractAddress("NonFungibleToken");
        const TatumNFT = await getContractAddress("TatumNFT");

        const addressMap = {
            NonFungibleToken,
            TatumNFT,
        };

        let code = await getScriptCode({
            name,
            addressMap,
        });

        // Define arguments
        const args = [
            [Alice, types.Address],
            [64, types.UInt64],
        ];

        const result = await executeScript({
            code,
            args,
        });

        // Add your expectations here
        expect(result).toBe('random url');
    });

    test("test script template id by address", async () => {
        const name = "id by address";

        const Alice = await getAccountAddress("Alice");

        // Generate addressMap from import statements
        const NonFungibleToken = await getContractAddress("NonFungibleToken");
        const TatumNFT = await getContractAddress("TatumNFT");

        const addressMap = {
            NonFungibleToken,
            TatumNFT,
        };

        let code = await getScriptCode({
            name,
            addressMap,
        });

        // Define arguments
        const args = [[Alice, types.Address]];

        try {
            const result = await executeScript({
                code,
                args,
            });

            // Add your expectations here
            expect(result).toBe([64]);
        } catch (e) {
            throw e;
        }
    });
});
