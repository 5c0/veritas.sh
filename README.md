# 🛡️ Veritas Protocol
### Hardware-Verified Reality for the Solana Seeker

[![Solana](https://img.shields.io/badge/Solana-Blockchain-purple?logo=solana)](https://solana.com)
[![Arweave](https://img.shields.io/badge/Arweave-Storage-black?logo=arweave)](https://arweave.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Veritas Protocol** is an anti-deepfake infrastructure designed for the Solana Seeker. It leverages hardware-level attestation to cryptographically certify the authenticity of digital media at the exact moment of capture.

---

## 🌪️ The Problem
In an era of generative AI, "seeing is no longer believing." Deepfakes and AI-generated misinformation have made it impossible to trust the origin or integrity of digital media. Current verification methods rely on fragile metadata or centralized authorities that can be easily bypassed.

## ✨ The Solution
Veritas moves the point of trust from software to **hardware**. By utilizing the **Solana Seeker's Trusted Execution Environment (TEE)**, we create an immutable record of reality:
1.  **Hardware Hashing:** Light hits the camera sensor, and a SHA-256 hash is generated inside the secure enclave.
2.  **Permanent Storage:** The raw image is beamed to **Arweave via Irys**, ensuring it can never be altered or deleted.
3.  **On-Chain Anchor:** The hardware-verified hash and storage URI are locked into a **Solana PDA**, creating a trustless, public receipt of truth.

---

## 🛠️ Technical Stack

-   **Mobile:** React Native (Expo) + Solana Mobile Wallet Adapter (MWA).
-   **Hardware:** Solana Seeker (Android TEE-Aligned Capture Intent).
-   **Blockchain:** Solana (Anchor / Rust) for anchoring reality.
-   **Storage:** Irys Network (Arweave L2) for instant, immutable storage.
-   **Web Explorer:** Next.js (App Router) + Tailwind CSS for instant verification.

---

## 🚀 Quick Start

### 1. Mobile App (The Capture)
```bash
cd mobile
npm install
npx expo run:android
```
*Requires a Solana Seeker or an Android device with the Solana Wallet Adapter installed.*

### 2. Web Explorer (The Verification)
```bash
cd web
npm install
npm run dev
```
Configure your environment variables:
```env
SPONSOR_KEY=your_solana_private_key
```

### 3. Smart Contract (The Anchor)
```bash
cd program
anchor build
anchor deploy
```

---

## 🗺️ Beyond the Hackathon
-   **Decentralized KYC:** Hardware-attested "Liveness Checks" to eliminate face-spoofing identity fraud.
-   **Citizen Journalism:** Providing war zones and protests with un-falsifiable reporting tools.
-   **Insurance & Audits:** Immutable proof-of-damage for auto and property claims.
-   **ZK-Proofs:** Proving you have a verified photo without revealing the photo itself until needed.

---

## 🏆 Hackathon Demo
Visit [veritas-sepia.vercel.app](https://veritas-sepia.vercel.app) to see the protocol in action. Capture a photo on your Seeker, and watch it become a permanent part of the blockchain in seconds.

---

**Built with ❤️ for the Solana Hackathon.**
*Protecting Reality, One Pixel at a Time.*
