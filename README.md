# hello-world

`STELLAR_VALUE_EMPTY_TX_SET` is a Stellar consensus value that represents a ledger close with an explicitly empty transaction set.

This repository is positioned as a small, focused Stellar developer reference project: a public example that explains narrowly scoped protocol concepts clearly and gives potential users or clients an easy way to understand the value of the work.

## Custom Stellar token lifecycle demo (Testnet)

This branch adds a runnable Stellar Testnet workflow for creating and operating a custom Stellar asset.

### What is implemented

- token economics definition (asset code, issuance, transfer, redemption amounts)
- automated setup of issuer, distribution, and recipient accounts on Testnet
- issuer controls: authorization required/revocable and clawback-enabled flags
- trustline creation and issuer authorization
- token issuance from issuer to distribution
- operational transfer from distribution to recipient
- redemption and circulation reduction (burn-style return to issuer)
- optional clawback demonstration
- operational and mainnet hardening documentation

### Run it

```bash
npm install
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

This implementation is for **Stellar Testnet** only.

## Who this helps

- Stellar developers learning ledger-close semantics
- Integrators who need quick protocol explanations and practical examples
- Teams evaluating Stellar-focused documentation or developer tooling work

## Why this repository exists

- explain specific Stellar protocol concepts in plain language
- show concise, high-signal technical writing in public
- serve as a portfolio piece for future Stellar documentation, tooling, or support work

## Project direction

This project fits a monetizable niche around **Stellar developer education and tooling**.

Planned expansion areas:

- protocol explainers
- example parsers and validation utilities
- integration notes for wallet, exchange, or indexer teams
- premium support or custom implementation help for teams building on Stellar

## Work with me

Potential paid offerings for this project and related work:

- custom Stellar integration guidance
- private architecture walkthroughs
- priority issue support
- sponsored feature development
- paid documentation or developer tooling work

## Support the project

- GitHub profile: https://github.com/Lionstooth94
- Sponsors: use the repository Sponsors button
- Sponsorship page: https://github.com/sponsors/Lionstooth94

## Contact

- GitHub profile: https://github.com/Lionstooth94
- Issue tracker: open an issue in this repository for project questions or bug reports

## Public proof of work checklist

To make this repository help generate income, keep it visibly active:

- improve the README as the project grows
- publish follow-up repositories in the same Stellar niche
- respond to issues and questions quickly
- pin the strongest related repositories on your GitHub profile
- promote updates where Stellar users and developers already gather

## Measure what gets traction

Track:

- stars
- forks
- inbound issues
- support requests
- sponsor clicks
- requests for custom work

Focus future effort on the content or tooling that gets the most real interest.

## More details

See `SUPPORT.md` for sponsorship, promotion, and publishing guidance tailored to this repository.

Before Mainnet, complete the hardening checklist in `/home/runner/work/hello-world/hello-world/docs/stellar-token-operations.md`.
