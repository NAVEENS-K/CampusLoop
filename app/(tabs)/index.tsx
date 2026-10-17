import { router } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListingCard } from "@/components/ListingCard";
import { useAppStore } from "@/data/AppStore";

export default function Home() {
  const { listings, savedIds, toggleSaved } = useAppStore();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F4F5F7" }} contentContainerStyle={{ padding: 18, paddingTop: 22, paddingBottom: 28 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 25, fontWeight: "900", color: "#17243A", letterSpacing: -0.8 }}>campus<Text style={{ color: "#3B6FE8" }}>loop</Text></Text>
          <Text style={{ color: "#788397", marginTop: 3, fontSize: 12 }}>Your college, in circulation.</Text>
        </View>
        <Pressable onPress={() => router.push("/(tabs)/profile")} style={{ width: 42, height: 42, borderRadius: 15, backgroundColor: "#E7EEFF", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="person-outline" size={20} color="#17243A" />
        </Pressable>
      </View>
      <View style={{ backgroundColor: "#17243A", borderRadius: 24, padding: 22, marginBottom: 23, overflow: "hidden" }}>
        <Text style={{ color: "#B8C9F4", fontSize: 10, fontWeight: "800", letterSpacing: 1.6 }}>BUY LESS NEW. REUSE MORE.</Text>
        <Text style={{ color: "#fff", fontSize: 31, lineHeight: 37, fontWeight: "900", marginTop: 11 }}>Good finds.{"\n"}Better campus.</Text>
        <Text style={{ color: "#D3DBE8", marginTop: 9, lineHeight: 20, fontSize: 13 }}>Pre-loved essentials, exchanged among students on your campus.</Text>
        <Pressable onPress={() => router.push("/(tabs)/search")} style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, marginTop: 17 }}>
          <Text style={{ color: "#17243A", fontWeight: "800", fontSize: 12 }}>Explore items</Text><Ionicons name="arrow-forward" size={15} color="#17243A" />
        </Pressable>
        <View style={{ position: "absolute", right: -24, bottom: -45, width: 150, height: 150, borderRadius: 75, borderWidth: 25, borderColor: "#FFFFFF10" }} />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <View><Text style={{ fontSize: 19, fontWeight: "900", color: "#17243A" }}>Fresh on campus</Text><Text style={{ color: "#788397", fontSize: 12, marginTop: 3 }}>{listings.length} useful finds</Text></View>
        <Pressable onPress={() => router.push("/(tabs)/search")}><Text style={{ color: "#3B6FE8", fontWeight: "800", fontSize: 12 }}>See all  ›</Text></Pressable>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {listings.map(item => <ListingCard key={item.id} item={item} saved={savedIds.includes(item.id)} onSave={() => toggleSaved(item.id)} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })} />)}
      </View>
      <Text style={{ textAlign: "center", color: "#788397", fontSize: 11, marginTop: 3 }}>Made for your campus community.</Text>
    </ScrollView>
  );
}