import { NextRequest, NextResponse } from 'next/server';
import Irys from '@irys/sdk';

// This is a Sponsor Key for Devnet uploads. 
// In a production app, you would keep this in a .env file.
const SPONSOR_KEY = process.env.SPONSOR_KEY;

export async function POST(req: NextRequest) {
    try {
        const { image, name } = await req.json();
        if (!image) return NextResponse.json({ error: "No image data" }, { status: 400 });

        // Initialize Irys on Solana Mainnet
        const irys = new Irys({
            url: "https://node1.irys.xyz",
            token: "solana",
            key: SPONSOR_KEY,
            config: { providerUrl: "https://api.mainnet-beta.solana.com" }
        });

        // Convert base64 to buffer
        const buffer = Buffer.from(image, 'base64');

        // CHECK FUNDING: Ensure we have enough balance on Irys node
        try {
            const price = await irys.getPrice(buffer.length);
            const balance = await irys.getLoadedBalance();

            if (balance.lt(price)) {
                console.log("Funding Irys node on Mainnet...");
                // Fund with a bit extra to cover future uploads (0.01 SOL is plenty)
                const fundAmount = price.multipliedBy(2).integerValue();
                await irys.fund(fundAmount);
                console.log("Funding successful.");
            }
        } catch (fundError) {
            console.error("Irys Funding Error:", fundError);
        }

        // Upload with metadata tags
        const tags = [
            { name: "Content-Type", value: "image/jpeg" },
            { name: "App-Name", value: "Veritas-Protocol" },
            { name: "Hardware-Attestation", value: "Solana-Seeker-TEE" },
        ];

        console.log("Uploading to Arweave via Irys Mainnet...");
        const receipt = await irys.upload(buffer, { tags });
        const url = `https://gateway.irys.xyz/${receipt.id}`;

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error("Irys Upload Error:", error);
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
}
