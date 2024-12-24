import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, QrCode, X } from 'lucide-react';
import { useWalletConnection } from './wallet/useWalletConnection';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WalletConnect() {
  const { address, balance, connectWallet } = useWalletConnection();
  const [showQR, setShowQR] = useState(false);

  const qrValue = 'tronlink://'; // TronLink deep link

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      {address ? (
        <div className="flex flex-col items-end gap-1 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <Button variant="outline" className="font-mono text-sm md:text-base">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
          {balance && (
            <span className="text-xs md:text-sm text-gray-600">
              Balance: {balance} USDT
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="bg-white hover:bg-gray-100"
                onClick={() => setShowQR(true)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Scan QR</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Scan with TronLink Mobile</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-6">
                <QRCodeSVG
                  value={qrValue}
                  size={256}
                  level="H"
                  includeMargin={true}
                  className="w-full max-w-[256px]"
                />
              </div>
              <p className="text-center text-sm text-gray-500">
                Open your TronLink mobile app to scan
              </p>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={connectWallet} 
            className="bg-primary hover:bg-primary/90 text-sm md:text-base"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect TronLink
          </Button>
        </div>
      )}
    </div>
  );
}