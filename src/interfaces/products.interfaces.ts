export interface ProductDataProps{
    products:[],
    summary:{},
    sales:{}
};


export interface ProductCardProps {
  id: string | number;
  name: string | undefined;
  price: number | undefined;
  image: string;
  discount?: number;
  status?:string;
  description?: string;
  rating?: number;
}
