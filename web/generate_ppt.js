const PptxGenJS = require("pptxgenjs");

let pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9';

// Define master slide for dark mode
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "111111" },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "000000" } } }
  ]
});

// Helper to create a slide
function createSlide(title, bodyText, notes) {
  let slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
  slide.addText(title, { x: 0.5, y: 0.5, w: "90%", h: 1, fontSize: 36, color: "00FF99", bold: true, fontFace: "Arial" });
  slide.addText(bodyText, { x: 0.5, y: 1.5, w: "90%", h: 5, fontSize: 24, color: "FFFFFF", fontFace: "Arial", valign: "top" });
  if (notes) slide.addNotes(notes);
  return slide;
}

// Slide 1
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addText("Veritas Protocol", { x: "10%", y: "40%", w: "80%", h: 1, fontSize: 60, color: "00FF99", bold: true, align: "center", fontFace: "Arial" });
slide1.addText("Hardware-Verified Reality in the Age of AI", { x: "10%", y: "55%", w: "80%", h: 1, fontSize: 24, color: "FFFFFF", align: "center", fontFace: "Arial" });
slide1.addNotes("Hi everyone, we are building Veritas. In a world where generative AI can create anything, we are building a protocol to prove what is real.");

// Slide 2
createSlide(
  "The Content Trust Crisis",
  "• Generative AI has made deepfakes indistinguishable from reality.\n• We can no longer trust photos on social media, in the news, or in legal disputes.\n• Current digital signatures are easily spoofed or stripped.",
  "The internet has a fundamental flaw: there is no cryptographic proof of origin for the media we consume. If I show you a picture of a car crash, how do you know I didn't generate it in Midjourney 5 minutes ago?"
);

// Slide 3
createSlide(
  "The Veritas Protocol",
  "• Capture: Uses the Solana Seeker's Trusted Execution Environment (TEE).\n• Hash: Generates an un-falsifiable SHA-256 hash at the exact moment of capture.\n• Store: Beams the image to Arweave for immutable, decentralized storage.\n• Anchor: Locks the hash and coordinates into a Solana Smart Contract.",
  "Veritas uses hardware to solve a software problem. By leveraging the secure enclave inside the Solana Seeker, we cryptographically sign reality the millisecond light hits the camera sensor."
);

// Slide 4
createSlide(
  "100% Decentralized Stack",
  "• Hardware: Solana Seeker (Android Camera Intent + Seed Vault bypass).\n• Storage: Irys Network (Arweave L2) for instant, permanent storage.\n• Blockchain: Solana PDA (Program Derived Addresses) for cheap, fast anchoring.\n• Verification: Stateless Next.js Explorer reading raw Solana transactions.",
  "We don't use Supabase or AWS to store the proofs. This is a 100% decentralized stack. If our company disappears tomorrow, the proofs we generate today will still be verifiable on-chain forever."
);

// Slide 5
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("Live Demonstration", { x: "10%", y: "40%", w: "80%", h: 1, fontSize: 60, color: "00FF99", bold: true, align: "center", fontFace: "Arial" });
slide5.addText("Proving Reality, Right Now.", { x: "10%", y: "55%", w: "80%", h: 1, fontSize: 24, color: "FFFFFF", align: "center", fontFace: "Arial" });
slide5.addNotes("1. Hold up the Seeker. 'I am taking a photo of the judges right now.'\n2. Show the app. 'The Seeker's hardware just hashed the image, funded the Arweave upload, and signed the Solana transaction.'\n3. Switch to browser. 'And here is the Veritas Explorer. It just queried the blockchain, pulled the permanent image from Arweave, and matched the hashes. This photo is cryptographically guaranteed to be real.'");

// Slide 6
createSlide(
  "Beyond the Hackathon",
  "• Citizen Journalism: Un-falsifiable reporting from war zones or protests.\n• Insurance & Audits: Cryptographic proof of damage for auto/home claims.\n• Social Media: 'Hardware Verified' badges on platforms like X or Farcaster.\n• Legal Evidence: Chain-of-custody established at the moment of capture.",
  "This isn't just a cool tech demo. The Veritas Protocol is the foundational infrastructure for the next generation of verified digital media. From insurance claims to citizen journalism, Veritas restores trust to the internet."
);

// Slide 7
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("Thank You", { x: "10%", y: "30%", w: "80%", h: 1, fontSize: 60, color: "00FF99", bold: true, align: "center", fontFace: "Arial" });
slide7.addText("Team Veritas\n\nTry it out: veritas.sh", { x: "10%", y: "50%", w: "80%", h: 2, fontSize: 32, color: "FFFFFF", align: "center", fontFace: "Arial" });
slide7.addNotes("Thank you. We are the Veritas team, and we are ready to answer your questions.");

pptx.writeFile({ fileName: "../Veritas_Pitch_Deck.pptx" }).then(fileName => {
  console.log(`Created file: ${fileName}`);
});
