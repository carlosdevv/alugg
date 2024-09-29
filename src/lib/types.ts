export type InventoryItem = {
  name: string;
  category: string;
  amount: number;
  objectPrice: number;
  rentPrice: number;
  itemInRenovation: boolean;
  itemInactive: boolean;
  size?: string;
  color?: string;
  description?: string;
  code?: string;
};
