"use client";

import { useState } from "react";
import { Search, ShieldCheck, ArrowLeft, Hexagon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Route to the dynamic result page
    router.push(`/verify/${searchQuery.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-white/40 group-hover:text-white transition-colors">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-500" />
          <span className="font-bold tracking-tight">VERITAS EXPLORER</span>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-32 pb-32">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
             <Hexagon className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Audit Explorer</h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">Verify cryptographic provenance by entering a Image Hash (SHA-256) or Solana Transaction Signature.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleVerify} className="relative mb-8 group max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex gap-3 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <div className="flex-grow flex items-center px-4">
              <Search className="w-5 h-5 text-white/30 mr-3" />
              <input 
                type="text" 
                placeholder="Paste TX Signature or Image Hash..."
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-xl"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Demo Mode Toggle */}
        <div className="flex justify-center">
            <button 
                type="button"
                onClick={() => {
                    setSearchQuery("2u64ZPeZAifd9MgjjJYYmd4wLAUB3mpwjh3QyVG7tx2SBM1JEosuCUVJg3C18n6zezhVXW4rSyvNLo7wPjqcQneH");
                    router.push(`/verify/2u64ZPeZAifd9MgjjJYYmd4wLAUB3mpwjh3QyVG7tx2SBM1JEosuCUVJg3C18n6zezhVXW4rSyvNLo7wPjqcQneH`);
                }}
                className="text-[10px] uppercase tracking-widest text-white/20 hover:text-purple-400 transition-colors border border-white/5 px-4 py-2 rounded-full"
            >
                Load Demo Transaction
            </button>
        </div>

      </main>
    </div>
  );
}
