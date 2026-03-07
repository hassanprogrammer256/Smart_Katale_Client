export interface OrderDataProps{
    pending: {
        count:number;
        details: [];
    };
    top_orders:[];
    order_details:[],
    summary:{
    delivered_orders:number;
    last_delivery_date:string;
}
};

export interface OrdersProps{
    pending_orders:number;
    details:[]
}



export interface CartProductProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discount: number;
    image: string;
  };
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}