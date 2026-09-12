import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const TESTNET_HORIZON_URL = "https://horizon-testnet.stellar.org";
const FRIENDBOT_URL = "https://friendbot.stellar.org";

const AUTH_REQUIRED_FLAG = 1;
const AUTH_REVOCABLE_FLAG = 2;
const AUTH_CLAWBACK_ENABLED_FLAG = 8;

const tokenConfig = {
  code: process.env.ASSET_CODE ?? "LION",
  issuanceAmount: process.env.ISSUANCE_AMOUNT ?? "1000000",
  transferAmount: process.env.TRANSFER_AMOUNT ?? "1000",
  redemptionAmount: process.env.REDEMPTION_AMOUNT ?? "250",
  enforceIssuerControls: (process.env.ENFORCE_ISSUER_CONTROLS ?? "true") === "true",
  runClawbackDemo: (process.env.RUN_CLAWBACK_DEMO ?? "false") === "true",
};

if (!/^[A-Z0-9]{1,12}$/.test(tokenConfig.code)) {
  throw new Error("ASSET_CODE must be 1-12 uppercase alphanumeric characters.");
}

const server = new Horizon.Server(TESTNET_HORIZON_URL);

async function friendbotFund(accountId) {
  const response = await fetch(`${FRIENDBOT_URL}/?addr=${encodeURIComponent(accountId)}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Friendbot funding failed for ${accountId}: ${body}`);
  }
}

async function createAndFundAccount(label) {
  const keypair = Keypair.random();
  await friendbotFund(keypair.publicKey());
  console.log(`${label} account created: ${keypair.publicKey()}`);
  return keypair;
}

async function submitTransaction({ sourceKeypair, operations, signers = [] }) {
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperations(operations)
    .setTimeout(60)
    .build();

  transaction.sign(sourceKeypair, ...signers);
  return server.submitTransaction(transaction);
}

async function main() {
  console.log("Token economics:", {
    assetCode: tokenConfig.code,
    issuanceAmount: tokenConfig.issuanceAmount,
    transferAmount: tokenConfig.transferAmount,
    redemptionAmount: tokenConfig.redemptionAmount,
    issuerControls: tokenConfig.enforceIssuerControls
      ? "auth required + revocable + clawback enabled"
      : "none",
  });

  const issuer = await createAndFundAccount("Issuer");
  const distribution = await createAndFundAccount("Distribution");
  const recipient = await createAndFundAccount("Recipient");

  const tokenAsset = new Asset(tokenConfig.code, issuer.publicKey());

  if (tokenConfig.enforceIssuerControls) {
    await submitTransaction({
      sourceKeypair: issuer,
      operations: [
        Operation.setOptions({
          setFlags:
            AUTH_REQUIRED_FLAG |
            AUTH_REVOCABLE_FLAG |
            AUTH_CLAWBACK_ENABLED_FLAG,
        }),
      ],
    });
    console.log("Issuer controls enabled (auth required/revocable/clawback).");
  }

  await submitTransaction({
    sourceKeypair: distribution,
    operations: [Operation.changeTrust({ asset: tokenAsset })],
  });

  await submitTransaction({
    sourceKeypair: recipient,
    operations: [Operation.changeTrust({ asset: tokenAsset })],
  });

  if (tokenConfig.enforceIssuerControls) {
    await submitTransaction({
      sourceKeypair: issuer,
      operations: [
        Operation.allowTrust({
          trustor: distribution.publicKey(),
          assetCode: tokenConfig.code,
          authorize: true,
        }),
        Operation.allowTrust({
          trustor: recipient.publicKey(),
          assetCode: tokenConfig.code,
          authorize: true,
        }),
      ],
    });
    console.log("Trustlines authorized by issuer.");
  }

  await submitTransaction({
    sourceKeypair: issuer,
    operations: [
      Operation.payment({
        destination: distribution.publicKey(),
        asset: tokenAsset,
        amount: tokenConfig.issuanceAmount,
      }),
    ],
  });
  console.log("Issued asset to distribution account.");

  await submitTransaction({
    sourceKeypair: distribution,
    operations: [
      Operation.payment({
        destination: recipient.publicKey(),
        asset: tokenAsset,
        amount: tokenConfig.transferAmount,
      }),
    ],
  });
  console.log("Transferred asset from distribution to recipient.");

  if (tokenConfig.runClawbackDemo) {
    await submitTransaction({
      sourceKeypair: issuer,
      operations: [
        Operation.clawback({
          from: recipient.publicKey(),
          asset: tokenAsset,
          amount: "10",
        }),
      ],
    });
    console.log("Clawback demo executed: issuer clawed back 10 units from recipient.");
  }

  await submitTransaction({
    sourceKeypair: recipient,
    operations: [
      Operation.payment({
        destination: distribution.publicKey(),
        asset: tokenAsset,
        amount: tokenConfig.redemptionAmount,
      }),
    ],
  });
  console.log("Recipient redeemed asset back to distribution account.");

  await submitTransaction({
    sourceKeypair: distribution,
    operations: [
      Operation.payment({
        destination: issuer.publicKey(),
        asset: tokenAsset,
        amount: tokenConfig.redemptionAmount,
      }),
    ],
  });
  console.log("Distribution returned redeemed amount to issuer (burn-style circulation reduction).");

  console.log("Lifecycle completed on Stellar Testnet.");
  console.log("Public keys:", {
    issuer: issuer.publicKey(),
    distribution: distribution.publicKey(),
    recipient: recipient.publicKey(),
  });
  console.log("Store secret keys securely if you will reuse these accounts.");
}

main().catch((error) => {
  console.error("Workflow failed:", error.message);
  process.exitCode = 1;
});
