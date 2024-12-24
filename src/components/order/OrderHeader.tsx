interface OrderHeaderProps {
  orderId: number;
}

export function OrderHeader({ orderId }: OrderHeaderProps) {
  return (
    <div className="flex items-start gap-4 border-b pb-4">
      <img
        src="/lovable-uploads/80299426-225e-4da8-a7ca-fcc09a931f22.png"
        alt="Konnaisseur Market"
        className="w-20 h-20 rounded-lg"
      />
      <div>
        <h2 className="font-bold text-lg">Order #{orderId}</h2>
        <p className="text-lg">Perfect lunch from Durger King.</p>
        <p className="text-gray-500">Konnaisseur Market</p>
      </div>
    </div>
  );
}