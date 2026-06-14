export type Network = 'TRC20' | 'ERC20' | 'BEP20' | 'SOL';

export const validateAddress = (network: Network, address: string): boolean => {
  switch (network) {
    case 'TRC20':
      return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
    case 'ERC20':
    case 'BEP20':
      return /^0x[0-9a-fA-F]{40}$/.test(address);
    case 'SOL':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    default:
      return false;
  }
};

export const truncateAddress = (address: string): string => {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};
