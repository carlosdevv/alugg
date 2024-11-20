export type InventoryItem = {
  name: string;
  category: {
    name: string;
  };
  amount: number;
  objectPrice: number;
  rentPrice: number;
  itemInRenovation: boolean;
  status: string;
  size?: string;
  color?: string;
  description?: string;
  code?: string;
};
