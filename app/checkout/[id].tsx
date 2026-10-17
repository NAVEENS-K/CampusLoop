import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useAppStore } from "@/data/AppStore";


const ink = "#17243A";
const muted = "#718096";
const line = "#E6EAF0";
const blue = "#4268F6";


export default function CheckoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings } = useAppStore();
  const item = listings.find(listing => listing.id === id);
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const total = useMemo(() => item?.price ?? 0, [item?.price]);

  const pay = () => {
    Alert.alert(
      "Assignment demo",
      `This is a UI-only prototype. No payment has been processed.\n\nSelected method: ${method === "upi" ? "UPI & more" : "Card / net banking"}\nDemo total: ₹${total.toLocaleString("en-IN")}`,
      [
        { text: "Back to checkout", style: "cancel" },
        { text: "Done", onPress: () => router.replace("/(tabs)") },
      ],
    );
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
          <View style={{ flex: 1 }}><Text style={{ color: ink, fontWeight: "900" }}>UPI & more</Text><Text style={{ color: muted, fontSize: 12, marginTop: 4 }}>Selected option for this demo</Text></View>
          <Ionicons name={method === "upi" ? "radio-button-on" : "radio-button-off"} size={21} color={blue} />
        </Pressable>
        <Pressable onPress={() => setMethod("card")} style={{ flexDirection: "row", alignItems: "center", gap: 13, padding: 16, borderRadius: 17, borderWidth: 1.5, borderColor: method === "card" ? blue : line, backgroundColor: method === "card" ? "#F0F4FF" : "white", marginTop: 9 }}>
          <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: "#F2F4F8", alignItems: "center", justifyContent: "center" }}><Ionicons name="card-outline" size={23} color={ink} /></View>
          <View style={{ flex: 1 }}><Text style={{ color: ink, fontWeight: "900" }}>Card / net banking</Text><Text style={{ color: muted, fontSize: 12, marginTop: 4 }}>Selected option for this demo</Text></View>
          <Ionicons name={method === "card" ? "radio-button-on" : "radio-button-off"} size={21} color={blue} />
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#EAF7EF", borderRadius: 16, padding: 14, marginTop: 18 }}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#15803D" />
          <View style={{ flex: 1 }}><Text style={{ color: "#166534", fontWeight: "900" }}>Payment UI preview</Text><Text style={{ color: "#35664A", fontSize: 12, lineHeight: 18, marginTop: 4 }}>This assignment screen is a visual prototype only. No payment provider is connected and no money will be charged.</Text></View>
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
