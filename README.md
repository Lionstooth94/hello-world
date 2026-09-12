# Stellar Custom Token (Testnet)

This repository now includes a runnable Stellar Testnet workflow for creating and operating a custom Stellar asset.

## What is implemented

- Token economics definition (asset code, issuance, transfer, redemption amounts)
- Automated setup of issuer, distribution, and recipient accounts on Testnet
- Issuer controls: authorization required/revocable and clawback-enabled flags
- Trustline creation and issuer authorization
- Token issuance from issuer to distribution
- Operational transfer from distribution to recipient
- Redemption and circulation reduction (burn-style return to issuer)
- Optional clawback demonstration
- Operational and mainnet hardening documentation

## Prerequisites

- Node.js 18+
- Internet access to Stellar Testnet Horizon and Friendbot

## Install

```bash
npm install
```

## Run lifecycle demo

```bash
npm run token:lifecycle
```

Optional environment variables:

- `ASSET_CODE` (default: `LION`)
- `ISSUANCE_AMOUNT` (default: `1000000`)
- `TRANSFER_AMOUNT` (default: `1000`)
- `REDEMPTION_AMOUNT` (default: `250`)
- `ENFORCE_ISSUER_CONTROLS` (`true`/`false`, default: `true`)
- `RUN_CLAWBACK_DEMO` (`true`/`false`, default: `false`)

Example:

```bash
ASSET_CODE=LIONX RUN_CLAWBACK_DEMO=true npm run token:lifecycle
```

## Notes

- This implementation is for **Stellar Testnet** only.
- Do not use test keys/funds for production.
- Before Mainnet, complete the hardening checklist in `/home/runner/work/hello-world/hello-world/docs/stellar-token-operations.md`.
