import { router, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/data/AppStore";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, savedIds, toggleSaved } = useAppStore();
  const item = listings.find(x => x.id === id);
  if (!item) return <View style={{ flex: 1, backgroundColor: "#F4F5F7", padding: 24 }}><Text onPress={() => router.back()}>‹ Back</Text><Text style={{ marginTop: 20, color: "#17243A" }}>Listing not found on this device.</Text></View>;
  const saved = savedIds.includes(item.id);
  return (
    <ScrollView style={{ backgroundColor: "#F4F5F7" }} contentContainerStyle={{ padding: 18, paddingTop: 24, paddingBottom: 30 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}><Ionicons name="arrow-back" size={18} color="#17243A" /><Text style={{ color: "#17243A", fontWeight: "800" }}>Back</Text></Pressable>
        <Pressable onPress={() => toggleSaved(item.id)} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}><Ionicons name={saved ? "heart" : "heart-outline"} size={21} color={saved ? "#D64055" : "#17243A"} /></Pressable>
      </View>
      <View style={{ height: 250, backgroundColor: item.accent, borderRadius: 24, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 100 }}>{item.emoji}</Text></View>
      <Text style={{ color: "#3B6FE8", fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginTop: 20 }}>{item.category.toUpperCase()}</Text>
      <Text style={{ fontSize: 25, lineHeight: 31, fontWeight: "900", color: "#17243A", marginTop: 6 }}>{item.title}</Text>
      <Text style={{ fontSize: 27, fontWeight: "900", color: "#17243A", marginTop: 9 }}>₹{item.price.toLocaleString("en-IN")}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
        {[item.condition, item.location].map(tag => <View key={tag} style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#E4E8EF", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 }}><Text style={{ color: "#40516B", fontSize: 11, fontWeight: "700" }}>{tag}</Text></View>)}
      </View>
      <Text style={{ fontSize: 17, fontWeight: "900", color: "#17243A", marginTop: 24 }}>About this item</Text>
      <Text style={{ fontSize: 14, lineHeight: 22, color: "#40516B", marginTop: 8 }}>{item.description}</Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 17, padding: 15, marginTop: 22, flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 45, height: 45, borderRadius: 15, backgroundColor: "#E7EEFF", alignItems: "center", justifyContent: "center" }}><Ionicons name="person-outline" size={21} color="#17243A" /></View>
        <View><Text style={{ fontWeight: "900", color: "#17243A" }}>{item.seller}</Text><Text style={{ color: "#788397", fontSize: 11, marginTop: 4 }}>Campus community · Demo account</Text></View>
      </View>
      <Pressable onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.id } })} style={{ backgroundColor: "#17243A", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 22 }}><Text style={{ color: "#fff", fontWeight: "900" }}>Message seller</Text></Pressable>
      <Pressable onPress={() => router.push({ pathname: "/requests/[id]", params: { id: item.id } })} style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#E4E8EF", padding: 16, borderRadius: 15, alignItems: "center", marginTop: 10 }}><Text style={{ color: "#17243A", fontWeight: "900" }}>Send purchase request</Text></Pressable>
      <Text onPress={() => Alert.alert("Report listing", "Reporting will be sent to moderators after backend integration.")} style={{ textAlign: "center", color: "#B42318", marginTop: 18, fontSize: 12, fontWeight: "700" }}>Report this listing</Text>
      <Text style={{ color: "#788397", fontSize: 10, lineHeight: 15, marginTop: 14, textAlign: "center" }}>Arrange a public campus meetup. Inspect the item before completing an exchange.</Text>
    </ScrollView>
  );
}