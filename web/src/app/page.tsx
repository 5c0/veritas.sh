import Image from "next/image";
import Link from "next/link";
import { Camera, ShieldCheck, MapPin, Search, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030303] text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#030303]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 via-blue-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">VERITAS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Protocol</Link>
          <Link href="/verify" className="hover:text-white transition-colors">Audit Explorer</Link>
          <Link href="#devs" className="hover:text-white transition-colors">Documentation</Link>
        </div>
        <Link 
          href="/verify"
          className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 group"
        >
          Launch Explorer
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center">
        <section className="relative w-full max-w-7xl px-8 pt-32 pb-20 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            TEE Hardware-Enclave Active
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
            Cryptographic <br />
            Content Attestation.
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed mb-12">
            Veritas leverages the Solana Seeker's hardware Secure Enclave to generate 
            un-falsifiable SHA-256 content digests at the point of capture. 
            Establishing provenance in the age of generative AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/download"
              className="px-8 py-4 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-500/25"
            >
              Initialize Client
            </Link>
            <Link 
              href="/verify"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Audit Explorer
            </Link>
          </div>

          {/* Floating UI Elements Simulation */}
          <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-tight text-white/90">Hardware Signed</h3>
              <p className="text-white/50 text-sm leading-relaxed font-medium">
                Raw sensor data is cryptographically signed within the TEE before reaching the application layer, preventing metadata manipulation.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-tight text-white/90">Geospatial Attestation</h3>
              <p className="text-white/50 text-sm leading-relaxed font-medium">
                Location telemetry is cryptographically locked at the moment of capture, ensuring geospatial authenticity on-chain.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                <Search className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-tight text-white/90">Audit Integrity</h3>
              <p className="text-white/50 text-sm leading-relaxed font-medium">
                Immutable registry on the Solana blockchain allows for real-time validation of content provenance by any third-party auditor.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2026 Veritas Protocol. Hardware-Attested Provenance.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Developer Portal</Link>
        </div>
      </footer>

    </div>
  );
}

