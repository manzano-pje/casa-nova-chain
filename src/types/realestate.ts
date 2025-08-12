export interface Property {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priceWei: number; // valor por dia em wei
  ownerId: string;
  isRented: boolean;
}
