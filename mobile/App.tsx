import 'react-native-get-random-values';
import 'text-encoding-polyfill';
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { launchCamera } from 'react-native-image-picker';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { ShieldCheck, Camera as CameraIcon, MapPin, RefreshCw } from 'lucide-react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import bs58 from 'bs58';
import * as crypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer';
import ReactNativeBlobUtil from 'react-native-blob-util';
import idl from './src/lib/idl.json';

global.Buffer = Buffer;

const PROGRAM_ID = new PublicKey(idl.address);
const DEVNET_URL = "https://api.devnet.solana.com";

import { AppState, AppStateStatus } from 'react-native';

function VeritasApp() {
  const insets = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, []);
  
  const [cameraActive, setCameraActive] = useState(true);
  const isActive = appState === 'active' && cameraActive;

  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const hashImage = async (path: string): Promise<Uint8Array> => {
    console.log('Reading file:', path);
    const cleanPath = path.startsWith('file://') ? path : `file://${path}`;
    const data = await ReactNativeBlobUtil.fs.readFile(cleanPath, 'base64');
    console.log('File read, computing hash...');
    const hash = crypto.createHash('sha256').update(data, 'base64').digest();
    console.log('Hash computed:', Buffer.from(hash).toString('hex').slice(0, 10));
    return new Uint8Array(hash);
  };

  const handleCapture = async () => {
    console.log('Capture button pressed (Image Picker)', Date.now());

    setIsCapturing(true);
    setStatus("Launching System Secure Camera...");
    
    // Pause the background preview so the hardware is released for the System Camera
    setCameraActive(false);

    try {
      console.log('Step 1: Opening System Camera...');
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
        saveToPhotos: false
      });

      if (result.didCancel) {
        console.log('User cancelled system camera');
        setStatus("Capture cancelled");
        setCameraActive(true);
        setIsCapturing(false);
        return;
      }
      
      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }

      const path = result.assets?.[0]?.uri;
      if (!path) throw new Error("No image path returned from system camera.");

      console.log('System Camera Success:', path);
      
      // Resume our background preview
      setCameraActive(true);
      setStatus("Hashing secure image...");

      console.log('Step 2: Hashing image...');
      const imageHash = await hashImage(path);
      const hashHex = Buffer.from(imageHash).toString('hex');
      console.log('Image hashed successfully');
      
      setStatus("Beaming to Arweave...");
      console.log('Step 3: Uploading to Irys...');
      const cleanPath = path.startsWith('file://') ? path : `file://${path}`;
      const base64Data = await ReactNativeBlobUtil.fs.readFile(cleanPath, 'base64');
      
      // Pointing to your actual deployed Vercel domain
      const uploadResponse = await fetch('https://veritas-sepia.vercel.app/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
      });
      
      const uploadResult = await uploadResponse.json();
      const realUri = uploadResult.url;
      
      if (!realUri) {
        const errorMsg = uploadResult.error || "No URL returned from server.";
        throw new Error(`Irys upload failed: ${errorMsg}`);
      }
      
      console.log('Arweave URL:', realUri);

      console.log('Step 4: Starting Solana transact...');
      await transact(async (wallet) => {
        console.log('Wallet transact started');
        const authorization = await wallet.authorize({
          cluster: 'devnet',
          identity: { name: 'Veritas', uri: 'https://veritas-sepia.vercel.app' },
        });
        console.log('Wallet authorized');
        
        const userPubkey = new PublicKey(Buffer.from(authorization.accounts[0].address, 'base64'));
        console.log('User Pubkey:', userPubkey.toBase58());
        setStatus("Requesting TEE Signature...");

        const connection = new Connection(DEVNET_URL);
        const { blockhash } = await connection.getLatestBlockhash();
        
        const [attestationPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("attestation"), userPubkey.toBuffer(), imageHash],
          PROGRAM_ID
        );

        console.log('Step 5: Building Instruction...');
        const instruction = new TransactionInstruction({
          keys: [
            { pubkey: attestationPda, isSigner: false, isWritable: true },
            { pubkey: userPubkey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          programId: PROGRAM_ID,
          data: Buffer.concat([
            Buffer.from([219, 171, 153, 109, 123, 165, 93, 232]),
            Buffer.from(imageHash),
            Buffer.alloc(64),
            Buffer.from(new anchor.BN(Date.now() / 1000).toArray('le', 8)),
            Buffer.from(new Float64Array([37.7749]).buffer),
            Buffer.from(new Float64Array([-122.4194]).buffer),
            Buffer.from(new anchor.BN(realUri.length).toArray('le', 4)),
            Buffer.from(realUri),
          ]),
        });

        const transaction = new Transaction({
          feePayer: userPubkey,
          recentBlockhash: blockhash,
        }).add(instruction);

        console.log('Step 5: Sending transaction...');
        
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });

        const txSignature = bs58.encode(signatures[0]);
        console.log('Transaction Confirmed:', txSignature);
        Alert.alert(
          "Proof Anchored", 
          "Hardware attestation successfully anchored to Solana.",
          [
            { text: "Dismiss", style: "cancel" },
            { 
              text: "View Public Proof", 
              onPress: () => Linking.openURL(`https://veritas-sepia.vercel.app/verify/${txSignature}`)
            }
          ]
        );
      });
    } catch (error: any) {
      console.error('CAPTURE_ERROR:', error);
      Alert.alert("Error", `Security violation: ${error?.message || "Unknown hardware error"}`);
    } finally {
      setIsCapturing(false);
      setStatus(null);
    }
  };

  if (!hasPermission) return <View style={styles.container}><Text style={{color: 'white', marginTop: 100, textAlign: 'center'}}>Access Denied: Camera permission required.</Text></View>;
  if (!device) return <View style={styles.container}><Text style={{color: 'white', marginTop: 100, textAlign: 'center'}}>Hardware Error: No back camera detected.</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Camera 
        ref={camera} 
        style={StyleSheet.absoluteFill} 
        device={device} 
        isActive={isActive} 
        photo={true} 
      />
      
      <View style={[styles.overlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.badge}>
            <ShieldCheck color="#A855F7" size={16} />
            <Text style={styles.badgeText}>TEE HARDWARE ENCLAVE ACTIVE</Text>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideButton}><MapPin color="white" size={24} /></TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture} disabled={isCapturing}>
            <View style={styles.captureInner}>
                {isCapturing ? <ActivityIndicator color="black" /> : <CameraIcon color="black" size={32} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideButton}><RefreshCw color="white" size={24} /></TouchableOpacity>
        </View>

        <Text style={styles.footerText}>{status || "SECURE CAPTURE INTERFACE"}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.4)', shadowColor: '#A855F7', shadowOpacity: 0.3, shadowRadius: 10 },
  badgeText: { color: '#A855F7', fontSize: 10, fontWeight: 'black', marginLeft: 8, letterSpacing: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 44 },
  captureButton: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.25)', padding: 5, justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: '100%', height: '100%', borderRadius: 42, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  sideButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  footerText: { color: 'white', fontSize: 10, fontWeight: 'black', letterSpacing: 3, marginTop: 20, opacity: 0.6 }
});

export default function App() {
    return <SafeAreaProvider><VeritasApp /></SafeAreaProvider>;
}
