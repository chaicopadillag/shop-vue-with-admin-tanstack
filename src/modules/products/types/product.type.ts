export type ProductType = {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: string;
  tags: string[];
  images: string[];
  user: User;
};

export type Size = 'L' | 'M' | 'S' | 'XL' | 'XS' | 'XXL';

type User = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
};
