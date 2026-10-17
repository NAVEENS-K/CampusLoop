declare module "react-native-razorpay" {
  export type RazorpayPaymentResult = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  export type RazorpayCheckoutOptions = {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description?: string;
    theme?: { color?: string };
    prefill?: { method?: "upi" | "card" | "netbanking" | "wallet" | "emi" };
    retry?: { enabled?: boolean; max_count?: number };
  };
  const RazorpayCheckout: {
    open(options: RazorpayCheckoutOptions): Promise<RazorpayPaymentResult>;
    removeSubscriptions?: () => void;
  };
  export default RazorpayCheckout;
}
