import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Text, TextInput, Pressable, View } from "react-native";
import { useState } from "react";
import { useAppStore } from "@/data/AppStore";

type LocalRequest = { id: string; title: string; offer: number; createdAt: string; status: "LOCAL_DEMO" };

export default function Request() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings } = useAppStore();
  const item = listings.find(x => x.id === id);
  const [price, setPrice] = useState(item ? String(item.price) : "");
  if (!item) return <Text>Listing not found</Text>;

  const submit = async () => {
    const offer = Number(price);
    if (!Number.isFinite(offer) || offer <= 0) {
      Alert.alert("Enter a valid offer", "Offer must be greater than ₹0.");
      return;
    }
    try {
      const raw = await AsyncStorage.getItem("campusloop:requests:v1");
      const existing = raw ? JSON.parse(raw) as LocalRequest[] : [];
      const request: LocalRequest = { id: item.id, title: item.title, offer: Math.round(offer), createdAt: new Date().toISOString(), status: "LOCAL_DEMO" };
      await AsyncStorage.setItem("campusloop:requests:v1", JSON.stringify([request, ...existing]));
      Alert.alert("Request saved on this device", "No seller was notified and no payment was made.", [{ text: "OK", onPress: () => router.back() }]);
    } catch {
      Alert.alert("Could not save request", "Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F5F7", padding: 18, paddingTop: 24 }}>
      <Text onPress={() => router.back()} style={{ fontWeight: "800", color: "#17243A" }}>‹ Back</Text>
      <Text style={{ fontSize: 26, fontWeight: "900", color: "#17243A", marginTop: 20 }}>Purchase request</Text>
      <Text style={{ color: "#788397", marginTop: 6 }}>{item.title}</Text>
      <Text style={{ fontWeight: "800", color: "#17243A", marginTop: 24, marginBottom: 8 }}>YOUR OFFER (₹)</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Enter amount" style={{ backgroundColor: "#fff", padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#E4E8EF", color: "#17243A" }} />
      <View style={{ backgroundColor: "#FFF0D6", padding: 14, borderRadius: 14, marginTop: 18 }}>
        <Text style={{ fontWeight: "900", color: "#9A5B00" }}>Local demo request</Text>
        <Text style={{ color: "#17243A", marginTop: 4, lineHeight: 19 }}>This saves a request on this device only. It does not notify the seller or charge money.</Text>
      </View>
      <Pressable onPress={submit} style={{ backgroundColor: "#17243A", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 22 }}><Text style={{ color: "#fff", fontWeight: "900" }}>Save purchase request</Text></Pressable>
    </View>
  );
}