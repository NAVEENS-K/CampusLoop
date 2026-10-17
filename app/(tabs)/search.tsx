import { useMemo, useState } from "react";
import { router } from "expo-router";
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListingCard } from "@/components/ListingCard";
import { useAppStore } from "@/data/AppStore";

export default function Search() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const { listings, savedIds, toggleSaved } = useAppStore();
  const cats = ["All", "Books", "Electronics", "Lab & Drawing", "Hostel"];
  const results = useMemo(() => listings.filter(x => (cat === "All" || x.category === cat) && (`${x.title} ${x.description} ${x.location}`).toLowerCase().includes(q.toLowerCase())), [q, cat, listings]);
  return (
    <ScrollView style={{ backgroundColor: "#F4F5F7" }} contentContainerStyle={{ padding: 18, paddingTop: 24, paddingBottom: 28 }}>
      <Text style={{ fontSize: 26, fontWeight: "900", color: "#17243A" }}>Find your next useful thing.</Text>
      <Text style={{ color: "#788397", marginTop: 5 }}>Search student listings around campus.</Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#E4E8EF", borderRadius: 16, paddingHorizontal: 13, marginVertical: 17 }}>
        <Ionicons name="search-outline" size={19} color="#788397" />
        <TextInput value={q} onChangeText={setQ} placeholder="Books, calculators, lab coats..." placeholderTextColor="#9AA4B4" style={{ flex: 1, padding: 14, color: "#17243A" }} />
        {q ? <Pressable onPress={() => setQ("")}><Ionicons name="close-circle" size={18} color="#788397" /></Pressable> : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
        {cats.map(c => <Pressable key={c} onPress={() => setCat(c)} style={{ paddingVertical: 10, paddingHorizontal: 14, marginRight: 7, borderRadius: 30, backgroundColor: cat === c ? "#17243A" : "#fff", borderWidth: 1, borderColor: cat === c ? "#17243A" : "#E4E8EF" }}><Text style={{ color: cat === c ? "#fff" : "#17243A", fontWeight: "700", fontSize: 12 }}>{c}</Text></Pressable>)}
      </ScrollView>
      <Text style={{ color: "#788397", fontSize: 12, marginBottom: 12 }}>{results.length} {results.length === 1 ? "item" : "items"} found</Text>
      {results.length ? <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {results.map(item => <ListingCard key={item.id} item={item} saved={savedIds.includes(item.id)} onSave={() => toggleSaved(item.id)} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })} />)}
      </View> : <View style={{ alignItems: "center", backgroundColor: "#fff", padding: 26, borderRadius: 18 }}><Ionicons name="search-outline" size={30} color="#788397" /><Text style={{ color: "#17243A", fontWeight: "800", marginTop: 10 }}>No matching items</Text><Text style={{ color: "#788397", fontSize: 12, marginTop: 5 }}>Try another search or category.</Text></View>}
    </ScrollView>
  );
}