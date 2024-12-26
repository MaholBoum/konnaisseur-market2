import { TronWindow } from '@/components/wallet/types';

const USDT_CONTRACT_ADDRESS = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';
const MERCHANT_ADDRESS = 'TVunEifCFGSS6MCiRzB3X3CyAMGJnHt2KT'; // Updated merchant address

export const processPaymentTransaction = async (total: number) => {
  const tronWindow = window as TronWindow;
  if (!tronWindow.tronWeb) {
    throw new Error('Please install TronLink to make payments');
  }

  // Check if we're on testnet
  const network = await tronWindow.tronWeb.fullNode.getNetwork();
  console.log('Current network:', network);
  
  if (!network || network.name !== 'shasta') {
    throw new Error('Please switch to Shasta Testnet in TronLink');
  }

  const address = tronWindow.tronWeb?.defaultAddress?.base58;
  if (!address) {
    throw new Error('Please connect your wallet first');
  }

  const contract = await tronWindow.tronWeb?.contract().at(USDT_CONTRACT_ADDRESS);
  if (!contract) {
    throw new Error('Failed to load USDT contract');
  }

  const amount = (total * 1e6).toString(); // Convert to USDT decimals (6)

  console.log('Checking allowance...');
  const allowance = await contract.allowance(address, MERCHANT_ADDRESS).call();
  const currentAllowance = parseInt(allowance._hex, 16);
  
  if (currentAllowance < Number(amount)) {
    console.log('Approving USDT spend...');
    const approvalTx = await contract.approve(
      MERCHANT_ADDRESS,
      amount
    ).send();
    console.log('Approval transaction:', approvalTx);
    
    // Wait for approval confirmation
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('Initiating transfer:', {
    from: address,
    to: MERCHANT_ADDRESS,
    amount: amount
  });

  const transaction = await contract.transfer(
    MERCHANT_ADDRESS,
    amount
  ).send();

  console.log('Transaction hash:', transaction);
  return transaction;
};