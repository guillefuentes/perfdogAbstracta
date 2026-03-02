/**
 * Pet status types
 */
export type PetStatus = 'available' | 'pending' | 'sold';

/**
 * Order status types
 */
export type OrderStatus = 'placed' | 'approved' | 'delivered';

/**
 * Pet interface
 */
export interface Pet {
  id?: number;
  category?: {
    id: number;
    name: string;
  };
  name: string;
  photoUrls: string[];
  tags?: Array<{
    id: number;
    name: string;
  }>;
  status: PetStatus;
}

/**
 * Order interface
 */
export interface Order {
  id?: number;
  petId: number;
  quantity: number;
  shipDate?: string;
  status: OrderStatus;
  complete?: boolean;
}

/**
 * API Response interface
 */
export interface ApiResponse {
  code?: number;
  type?: string;
  message?: string;
}
