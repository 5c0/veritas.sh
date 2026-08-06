"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, MapPin, Calendar, Clock, User, ArrowLeft, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchAttestation, fetchTransaction, formatPubkey } from "@/lib/solana";

export default function VerifyResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      
      try {
        let data = null;
        // Check if it's a 64-char hex (Hash) or something else (Transaction Signature)
        if (/^[0-9a-fA-F]{64}$/.test(id)) {
            data = await fetchAttestation(id);
        } else {
            // Assume it's a transaction signature
            data = await fetchTransaction(id);
        }

        if (data) {
          setResult({
            ...data,
            timestamp: new Date(data.timestamp).toISOString(),
            signature: data.signature,
          });
        } else {
          setError("No hardware attestation found for this ID.");
        }
      } catch (e) {
        setError("Failed to query the blockchain. Check your ID format.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <Link href="/verify" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-white/40 group-hover:text-white transition-colors">New Search</span>
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-500" />
          <span className="font-bold tracking-tight">VERITAS EXPLORER</span>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-12 pb-32">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-white/50 font-medium animate-pulse">Querying Solana Network...</p>
            </div>
        )}

        {error && !isLoading && (
            <div className="text-center py-32">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Attestation Not Found</h2>
                <p className="text-white/50 mb-8">{error}</p>
                <Link href="/verify" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                    Try Another Search
                </Link>
            </div>
        )}

        {result && !isLoading && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="p-1 rounded-3xl bg-gradient-to-tr from-purple-500/50 via-blue-500/50 to-emerald-500/50 shadow-2xl shadow-purple-500/10">
              <div className="p-8 rounded-[22px] bg-[#0A0A0A] relative overflow-hidden">
                {/* Certificate Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
                
                <div className="flex justify-between items-start mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-widest uppercase border border-emerald-500/20">
                        <ShieldCheck className="w-4 h-4" />
                        Attestation Validated
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Protocol Version</p>
                        <p className="text-sm font-mono text-white/40">v1.0.4-LTS</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-3">SHA-256 Content Digest</h3>
                      <p className="font-mono text-sm break-all text-white/90 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">{result.hash}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Attestation Date
                        </h3>
                        <p className="text-sm font-medium text-white/80">{new Date(result.timestamp).toLocaleDateString()}</p>
                        <p className="text-xs text-white/40 mt-1">{new Date(result.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <User className="w-3 h-3" /> Originator
                        </h3>
                        <p className="text-sm font-mono text-purple-400">{formatPubkey(result.creator)}</p>
                        <p className="text-[10px] text-white/30 mt-1 uppercase font-bold">Hardware ID Confirmed</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Geospatial Attestation
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 text-xs font-mono">
                            {result.lat.toFixed(6)}° N
                        </div>
                        <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 text-xs font-mono">
                            {result.long.toFixed(6)}° W
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-xs text-white/40 font-mono">Tx: {result.signature}</p>
                    </div>
                  </div>

                  {/* Visual Proof */}
                  <div className="flex flex-col gap-6">
                    <div className="aspect-[4/3] rounded-2xl bg-zinc-900 border border-white/5 relative flex items-center justify-center overflow-hidden group">
                       {result.uri ? (
                         <img 
                            src={result.uri} 
                            alt="Hardware Attested Content" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                         />
                       ) : (
                         <>
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
                            <div className="relative flex flex-col items-center">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 animate-pulse">
                                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                </div>
                            </div>
                         </>
                       )}
                       
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                       <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Hardware ID</p>
                                    <p className="text-xs font-mono text-white/80">SOL-SEEKER-8821</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs font-bold text-emerald-500">TRUSTED</p>
                                </div>
                            </div>
                       </div>
                    </div>

                    <a 
                      href={`https://solscan.io/tx/${id}?cluster=devnet`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                    >
                        View on Solscan
                        <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
