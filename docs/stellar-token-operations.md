# Stellar Token Operations Guide

## 1) Token economics

Define and approve these values before any issuance:

- **Asset code**: 1-12 uppercase alphanumeric characters
- **Issuance policy**: fixed cap or controlled minting schedule
- **Circulating supply controls**: distribution account limits, transfer rules
- **Redemption policy**: how tokens return to treasury/issuer
- **Clawback/freeze policy**: when issuer interventions are allowed

Document policy owners and approval flow for every future change.

## 2) Account model

Use separate roles:

- **Issuer account**: creates and controls the asset; minimal direct usage
- **Distribution account**: receives minted supply and performs normal transfers
- **Recipient/user accounts**: establish trustlines before receiving assets

For production, keep issuer keys offline whenever possible.

## 3) Issuer control options

The workflow supports enabling:

- `AUTH_REQUIRED` (trustline authorization required)
- `AUTH_REVOCABLE` (authorization can be revoked)
- `AUTH_CLAWBACK_ENABLED` (issuer can claw back balances)

Enable only what compliance and business requirements need.

## 4) Issuance lifecycle (implemented script)

The script at `/home/runner/work/hello-world/hello-world/scripts/stellar-token-lifecycle.mjs` performs:

1. Create issuer, distribution, recipient accounts on Testnet
2. Configure issuer flags (optional)
3. Create trustlines from distribution and recipient to issuer asset
4. Authorize trustlines (when auth is required)
5. Issue asset from issuer to distribution
6. Transfer from distribution to recipient
7. Redeem from recipient back to distribution
8. Return redeemed amount to issuer to reduce circulation
9. Optional clawback demonstration

## 5) Key management

Before Mainnet:

- Use hardware-backed key custody where possible
- Apply multisig thresholds for issuer and treasury-critical accounts
- Limit who can sign issuer operations
- Enforce secure backup and recovery procedures
- Rotate operational credentials and audit access regularly

## 6) Recovery and incident response

Maintain runbooks for:

- Compromised signer keys
- Unauthorized transfer attempts
- Incorrect issuance or accidental over-minting
- Emergency freeze/clawback decision flow
- Communication and legal/compliance escalation paths

## 7) Compliance and governance

Define:

- Eligibility and sanctions screening requirements
- Jurisdictional transfer restrictions
- Audit logging and retention
- Approval controls for issuer-level operations

## 8) Mainnet hardening checklist

Before launch:

- Complete end-to-end lifecycle validation in staging/Testnet
- Enable required monitoring and alerts (failed tx, anomalous volume)
- Enforce multisig for sensitive actions
- Conduct security review and dependency review
- Validate disaster recovery tabletop scenarios
- Final sign-off from engineering, security, and compliance owners
