import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useAppStore } from "@/data/AppStore";

const ink = "#17243A";
const muted = "#718096";
const line = "#E6EAF0";
const blue = "#4268F6";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, savedIds, toggleSaved } = useAppStore();
  const item = listings.find(x => x.id === id);
  if (!item) return <View style={{ flex: 1, backgroundColor: "#F7F8FB", padding: 24, justifyContent: "center" }}><Ionicons name="search-outline" size={42} color={muted} /><Text style={{ color: ink, fontSize: 22, fontWeight: "900", marginTop: 16 }}>Listing not found</Text><Text style={{ color: muted, lineHeight: 22, marginTop: 8 }}>This item may have been removed or is not available on this device.</Text><Pressable onPress={() => router.back()} style={{ backgroundColor: ink, borderRadius: 15, padding: 15, alignItems: "center", marginTop: 22 }}><Text style={{ color: "white", fontWeight: "900" }}>Go back</Text></Pressable></View>;
  const saved = savedIds.includes(item.id);
  return (
    <View style={{ flex: 1, backgroundColor: "#F7F8FB" }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 18, paddingBottom: 30 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 }}><Ionicons name="arrow-back" size={20} color={ink} /><Text style={{ color: ink, fontWeight: "800" }}>Explore</Text></Pressable>
          <Pressable accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"} onPress={() => toggleSaved(item.id)} style={{ width: 44, height: 44, borderRadius: 15, backgroundColor: "white", borderWidth: 1, borderColor: line, alignItems: "center", justifyContent: "center" }}><Ionicons name={saved ? "heart" : "heart-outline"} size={22} color={saved ? "#D64055" : ink} /></Pressable>
        </View>
        <View style={{ height: 255, borderRadius: 26, backgroundColor: item.accent, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 88 }}>{item.emoji}</Text></View>
          <View style={{ position: "absolute", bottom: 14, left: 14, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 }}><Ionicons name="checkmark-circle" size={15} color="#16804A" /><Text style={{ color: ink, fontSize: 11, fontWeight: "800" }}>Campus listing</Text></View>
        </View>
        <Text style={{ color: blue, fontSize: 11, fontWeight: "900", letterSpacing: 1.7, marginTop: 22 }}>{item.category.toUpperCase()}</Text>
        <Text style={{ color: ink, fontSize: 27, lineHeight: 33, fontWeight: "900", marginTop: 7 }}>{item.title}</Text>
        <Text style={{ color: ink, fontSize: 30, fontWeight: "900", marginTop: 10 }}>₹{item.price.toLocaleString("en-IN")}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 13, flexWrap: "wrap" }}>{[{icon:"sparkles-outline" as const,label:item.condition},{icon:"location-outline" as const,label:item.location}].map(tag => <View key={tag.label} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "white", borderWidth: 1, borderColor: line, borderRadius: 30, paddingHorizontal: 12, paddingVertical: 8 }}><Ionicons name={tag.icon} size={14} color={muted} /><Text style={{ color: "#40516B", fontSize: 12, fontWeight: "700" }}>{tag.label}</Text></View>)}</View>
        <View style={{ backgroundColor: "white", borderRadius: 21, borderWidth: 1, borderColor: line, padding: 17, marginTop: 23 }}>
          <Text style={{ color: ink, fontSize: 17, fontWeight: "900" }}>Item details</Text><Text style={{ color: muted, fontSize: 14, lineHeight: 23, marginTop: 9 }}>{item.description}</Text>
          <View style={{ height: 1, backgroundColor: line, marginVertical: 16 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}><View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "#EDF1FF", alignItems: "center", justifyContent: "center" }}><Ionicons name="person-outline" size={23} color={ink} /></View><View style={{ flex: 1 }}><Text style={{ color: ink, fontWeight: "900" }}>{item.seller}</Text><Text style={{ color: muted, fontSize: 12, marginTop: 4 }}>Campus community · Demo account</Text></View><Ionicons name="school-outline" size={21} color={blue} /></View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 17, backgroundColor: "#EAF7EF", marginTop: 15 }}><Ionicons name="shield-checkmark-outline" size={21} color="#16804A" /><View style={{ flex: 1 }}><Text style={{ color: "#166534", fontWeight: "900" }}>Shop with confidence</Text><Text style={{ color: "#35664A", fontSize: 12, lineHeight: 18, marginTop: 4 }}>Meet in a public campus spot and inspect the item. Online checkout requires a connected API listing.</Text></View></View>
        <Pressable onPress={() => router.push({ pathname: "/checkout/[id]", params: { id: item.id } })} style={{ backgroundColor: blue, borderRadius: 16, minHeight: 55, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 20 }}><Ionicons name="lock-closed-outline" size={18} color="white" /><Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>Buy securely · ₹{item.price.toLocaleString("en-IN")}</Text></Pressable>
        <Pressable onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.id } })} style={{ backgroundColor: "white", borderWidth: 1, borderColor: line, borderRadius: 16, minHeight: 53, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }}><Ionicons name="chatbubble-ellipses-outline" size={18} color={ink} /><Text style={{ color: ink, fontWeight: "900" }}>Message seller</Text></Pressable>
        <Pressable onPress={() => router.push({ pathname: "/requests/[id]", params: { id: item.id } })} style={{ alignItems: "center", paddingVertical: 15 }}><Text style={{ color: muted, fontWeight: "800", fontSize: 12 }}>Make a different offer</Text></Pressable>
        <Text onPress={() => Alert.alert("Report listing", "Reporting will be sent to moderators after backend integration.")} style={{ textAlign: "center", color: "#B42318", marginTop: 3, fontSize: 12, fontWeight: "800" }}>Report this listing</Text>
      </ScrollView>
    </View>
  );
}