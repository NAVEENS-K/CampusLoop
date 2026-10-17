import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, Pressable, View } from "react-native";
import { router } from "expo-router";
import { useAppStore } from "@/data/AppStore";

const categories = ["Books", "Electronics", "Lab & Drawing", "Hostel"];
export default function Sell() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Books");
  const { createListing } = useAppStore();

  const field = (label: string, value: string, setter: (v: string) => void, placeholder: string, multiline = false, numeric = false) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "800", color: "#17243A", marginBottom: 7, fontSize: 12 }}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor="#9AA4B4" multiline={multiline} keyboardType={numeric ? "numeric" : "default"} style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#E4E8EF", borderRadius: 14, padding: 14, minHeight: multiline ? 105 : 49, textAlignVertical: multiline ? "top" : "center", color: "#17243A" }} />
    </View>
  );

  const publish = () => {
    const amount = Number(price);
    if (title.trim().length < 4 || !Number.isFinite(amount) || amount <= 0 || desc.trim().length < 10) {
      Alert.alert("Check your listing", "Enter a title (at least 4 characters), a valid price, and a description (at least 10 characters).");
      return;
    }
    const item = createListing({ title: title.trim(), category, price: Math.round(amount), condition: "Good", description: desc.trim(), seller: "You", emoji: category === "Books" ? "📘" : category === "Electronics" ? "🔌" : category === "Hostel" ? "💡" : "📐", accent: "#E7EEFF", location: "Main campus" });
    Alert.alert("Listing published locally", "Your listing is saved on this device. It is not visible to other students until a backend is connected.", [{ text: "View listing", onPress: () => router.push({ pathname: "/listing/[id]", params: { id: item.id } }) }, { text: "Done", onPress: () => { setTitle(""); setPrice(""); setDesc(""); } }]);
  };

  return (
    <ScrollView style={{ backgroundColor: "#F4F5F7" }} contentContainerStyle={{ padding: 18, paddingTop: 24, paddingBottom: 30 }}>
      <Text style={{ fontSize: 26, fontWeight: "900", color: "#17243A" }}>Give it a second life.</Text>
      <Text style={{ color: "#788397", marginTop: 5, marginBottom: 22 }}>List a useful item for someone on your campus.</Text>
      <View style={{ backgroundColor: "#E7EEFF", borderRadius: 17, padding: 16, marginBottom: 20 }}>
        <Text style={{ fontWeight: "900", color: "#17243A" }}>A good listing gets noticed</Text>
        <Text style={{ color: "#40516B", fontSize: 12, lineHeight: 18, marginTop: 5 }}>Use a clear title, honest condition and a fair price. Arrange a public campus pickup.</Text>
      </View>
      {field("ITEM TITLE", title, setTitle, "e.g. Engineering Mathematics")}
      <Text style={{ fontWeight: "800", color: "#17243A", marginBottom: 8, fontSize: 12 }}>CATEGORY</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 17 }}>
        {categories.map(c => <Pressable key={c} onPress={() => setCategory(c)} style={{ borderRadius: 22, paddingVertical: 10, paddingHorizontal: 13, backgroundColor: category === c ? "#17243A" : "#fff", borderWidth: 1, borderColor: category === c ? "#17243A" : "#E4E8EF" }}><Text style={{ color: category === c ? "#fff" : "#17243A", fontWeight: "700", fontSize: 12 }}>{c}</Text></Pressable>)}
      </View>
      {field("PRICE (₹)", price, setPrice, "250", false, true)}
      {field("DESCRIPTION", desc, setDesc, "Describe condition and what's included", true)}
      <Pressable onPress={publish} style={{ backgroundColor: "#17243A", borderRadius: 15, padding: 16, alignItems: "center" }}><Text style={{ color: "#fff", fontWeight: "900" }}>Publish listing</Text></Pressable>
      <Text style={{ color: "#788397", fontSize: 11, lineHeight: 16, marginTop: 12, textAlign: "center" }}>Saved on this device for now. Server publishing will be enabled when the API is running.</Text>
    </ScrollView>
  );
}