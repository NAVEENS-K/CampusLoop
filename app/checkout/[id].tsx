import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useAppStore } from "@/data/AppStore";
import { isApiConfigured } from "@/data/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
const ink = "#17243A";
const muted = "#718096";
const line = "#E6EAF0";
const blue = "#4268F6";

type OrderResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  listingTitle: string;
  description: string;
};
type RazorpayResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings } = useAppStore();
  const item = listings.find(listing => listing.id === id);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const total = useMemo(() => item?.price ?? 0, [item?.price]);

  const pay = async () => {
    if (!item) return;
    if (!isApiConfigured() || !/^\d+$/.test(item.id)) {
      Alert.alert("Online checkout unavailable", "This is a local demo listing. Start the Spring Boot API, connect it to MySQL, and open a listing loaded from the backend to enable Razorpay checkout.");
      return;
    }
    if (!API_URL) return;
    setLoading(true);
    try {
      const orderResponse = await fetch(`${API_URL}/api/payments/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: Number(item.id) }),
      });
      const orderData = await orderResponse.json() as OrderResponse & { message?: string };
      if (!orderResponse.ok) throw new Error(orderData.message || "Could not start checkout. Check Razorpay test credentials.");
      // Razorpay's native SDK is available in an Expo development/production build, not Expo Go.
      const Razorpay = require("react-native-razorpay").default;
      const result = await Razorpay.open({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "CampusLoop",
        description: orderData.listingTitle,
        theme: { color: blue },
        retry: { enabled: true, max_count: 2 },
      }) as RazorpayResult;
      const verifyResponse = await fetch(`${API_URL}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: result.razorpay_order_id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        }),
      });
      const verification = await verifyResponse.json() as { verified?: boolean; message?: string };
      if (!verifyResponse.ok || !verification.verified) throw new Error(verification.message || "Payment verification failed. Do not retry until you check the payment status.");
      Alert.alert("Payment signature verified", "Razorpay returned a valid payment signature. Final payment capture and seller settlement still require server webhook confirmation.", [
        { text: "Done", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment was cancelled or could not be completed.";
      Alert.alert("Checkout not completed", message);
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return <View style={{ flex: 1, backgroundColor: "#F7F8FB", padding: 24, justifyContent: "center" }}>
      <Ionicons name="bag-check-outline" size={44} color={muted} />
      <Text style={{ color: ink, fontSize: 22, fontWeight: "900", marginTop: 14 }}>Item unavailable</Text>
      <Text style={{ color: muted, lineHeight: 22, marginTop: 8 }}>This listing is no longer available on this device.</Text>
      <Pressable onPress={() => router.back()} style={{ marginTop: 24, padding: 15, backgroundColor: ink, borderRadius: 15, alignItems: "center" }}><Text style={{ color: "white", fontWeight: "800" }}>Go back</Text></Pressable>
    </View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F8FB" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 18, paddingBottom: 24 }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <Ionicons name="arrow-back" size={20} color={ink} /><Text style={{ color: ink, fontWeight: "800" }}>Back to item</Text>
        </Pressable>
        <Text style={{ color: blue, fontSize: 11, letterSpacing: 1.8, fontWeight: "900" }}>CAMPUSLOOP CHECKOUT</Text>
        <Text style={{ color: ink, fontSize: 29, lineHeight: 35, fontWeight: "900", marginTop: 8 }}>A better find,{"\n"}a safer checkout.</Text>
        <Text style={{ color: muted, fontSize: 14, lineHeight: 21, marginTop: 8 }}>Review your item and amount before continuing to secure payment.</Text>

        <View style={{ marginTop: 24, padding: 17, backgroundColor: "white", borderRadius: 22, borderWidth: 1, borderColor: line }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 76, height: 76, borderRadius: 18, backgroundColor: item.accent, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 38 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: muted, fontSize: 10, letterSpacing: 1.2, fontWeight: "900" }}>{item.category.toUpperCase()}</Text>
              <Text style={{ color: ink, fontSize: 16, lineHeight: 21, fontWeight: "900", marginTop: 5 }}>{item.title}</Text>
              <Text style={{ color: muted, fontSize: 12, marginTop: 5 }}>{item.condition} · {item.location}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: line, marginVertical: 17 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}><Text style={{ color: muted }}>Item price</Text><Text style={{ color: ink, fontWeight: "800" }}>₹{total.toLocaleString("en-IN")}</Text></View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}><Text style={{ color: muted }}>Platform fee</Text><Text style={{ color: "#15803D", fontWeight: "800" }}>₹0</Text></View>
          <View style={{ height: 1, backgroundColor: line, marginBottom: 14 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={{ color: ink, fontSize: 16, fontWeight: "900" }}>Total payable</Text><Text style={{ color: ink, fontSize: 26, fontWeight: "900" }}>₹{total.toLocaleString("en-IN")}</Text></View>
        </View>

        <Text style={{ color: ink, fontSize: 16, fontWeight: "900", marginTop: 25, marginBottom: 12 }}>Payment method</Text>
        <Pressable onPress={() => setMethod("upi")} style={{ flexDirection: "row", alignItems: "center", gap: 13, padding: 16, borderRadius: 17, borderWidth: 1.5, borderColor: method === "upi" ? blue : line, backgroundColor: method === "upi" ? "#F0F4FF" : "white" }}>
          <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}><Ionicons name="flash-outline" size={23} color={blue} /></View>
          <View style={{ flex: 1 }}><Text style={{ color: ink, fontWeight: "900" }}>UPI & more</Text><Text style={{ color: muted, fontSize: 12, marginTop: 4 }}>Choose UPI apps in Razorpay checkout</Text></View>
          <Ionicons name={method === "upi" ? "radio-button-on" : "radio-button-off"} size={21} color={blue} />
        </Pressable>
        <Pressable onPress={() => setMethod("card")} style={{ flexDirection: "row", alignItems: "center", gap: 13, padding: 16, borderRadius: 17, borderWidth: 1.5, borderColor: method === "card" ? blue : line, backgroundColor: method === "card" ? "#F0F4FF" : "white", marginTop: 9 }}>
          <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: "#F2F4F8", alignItems: "center", justifyContent: "center" }}><Ionicons name="card-outline" size={23} color={ink} /></View>
          <View style={{ flex: 1 }}><Text style={{ color: ink, fontWeight: "900" }}>Card / net banking</Text><Text style={{ color: muted, fontSize: 12, marginTop: 4 }}>Available payment options depend on provider</Text></View>
          <Ionicons name={method === "card" ? "radio-button-on" : "radio-button-off"} size={21} color={blue} />
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#EAF7EF", borderRadius: 16, padding: 14, marginTop: 18 }}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#15803D" />
          <View style={{ flex: 1 }}><Text style={{ color: "#166534", fontWeight: "900" }}>Secure payment flow</Text><Text style={{ color: "#35664A", fontSize: 12, lineHeight: 18, marginTop: 4 }}>Payment details are handled by the payment provider. CampusLoop does not store your card details.</Text></View>
        </View>
        <Pressable disabled={loading} onPress={pay} style={{ backgroundColor: ink, minHeight: 56, borderRadius: 17, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 22, opacity: loading ? 0.7 : 1 }}>
          {loading ? <ActivityIndicator color="white" /> : <Ionicons name="lock-closed-outline" size={18} color="white" />}
          <Text style={{ color: "white", fontSize: 15, fontWeight: "900" }}>{loading ? "Preparing secure checkout…" : `Pay ₹${total.toLocaleString("en-IN")}`}</Text>
        </Pressable>
        <Text style={{ color: muted, fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: 12 }}>Test credentials are required for online checkout. Inspect the item at a public campus meetup before accepting it.</Text>
      </ScrollView>
    </View>
  );
}
