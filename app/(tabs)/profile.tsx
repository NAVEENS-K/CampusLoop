import { router } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListingCard } from "@/components/ListingCard";
import { useAppStore } from "@/data/AppStore";

export default function Profile() {
  const { listings, savedIds, myListingIds, toggleSaved } = useAppStore();
  const saved = listings.filter(x => savedIds.includes(x.id));
  const mine = listings.filter(x => myListingIds.includes(x.id));
  const opts = [
    { title: "My listings", subtitle: `${mine.length} items published on this device`, action: () => Alert.alert("My listings", mine.length ? "Your listings are shown below." : "You have not published a listing yet.") },
    { title: "Wishlist", subtitle: `${saved.length} saved items`, action: () => Alert.alert("Wishlist", saved.length ? "Your saved items are shown below." : "Tap the heart on any item to save it.") },
    { title: "Purchase requests", subtitle: "Track offers and responses", action: () => Alert.alert("Purchase requests", "Request history will sync once the backend is connected.") },
    { title: "Safety centre", subtitle: "Safer campus meetups", action: () => Alert.alert("Campus safety", "Meet in a busy public campus location, inspect items before paying, and never share passwords or verification codes.") },
    { title: "Settings & privacy", subtitle: "Account and app preferences", action: () => Alert.alert("Settings", "Account settings will be available after sign-in is implemented.") },
  ];
  return (
    <ScrollView style={{ backgroundColor: "#F4F5F7" }} contentContainerStyle={{ padding: 18, paddingTop: 24, paddingBottom: 30 }}>
      <Text style={{ fontSize: 26, fontWeight: "900", color: "#17243A" }}>Your profile</Text>
      <View style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#E4E8EF", borderRadius: 22, alignItems: "center", padding: 22, marginTop: 18 }}>
        <View style={{ width: 70, height: 70, borderRadius: 24, backgroundColor: "#E7EEFF", alignItems: "center", justifyContent: "center" }}><Ionicons name="school-outline" size={31} color="#17243A" /></View>
        <Text style={{ fontSize: 19, fontWeight: "900", color: "#17243A", marginTop: 12 }}>Campus Student</Text>
        <Text style={{ color: "#9A5B00", fontWeight: "700", marginTop: 5 }}>Demo profile · Not verified</Text>
        <Text style={{ color: "#788397", marginTop: 5 }}>Your College</Text>
        <View style={{ flexDirection: "row", gap: 22, marginTop: 18 }}>
          <View style={{ alignItems: "center" }}><Text style={{ fontWeight: "900", fontSize: 18, color: "#17243A" }}>{mine.length}</Text><Text style={{ fontSize: 11, color: "#788397" }}>Listings</Text></View>
          <View style={{ alignItems: "center" }}><Text style={{ fontWeight: "900", fontSize: 18, color: "#17243A" }}>{saved.length}</Text><Text style={{ fontSize: 11, color: "#788397" }}>Saved</Text></View>
        </View>
      </View>
      <Text style={{ color: "#788397", fontWeight: "800", fontSize: 11, letterSpacing: 1.3, marginTop: 24, marginBottom: 8 }}>ACCOUNT</Text>
      {opts.map((x, i) => <Pressable key={x.title} onPress={x.action} style={{ backgroundColor: "#fff", padding: 15, borderBottomWidth: i === opts.length - 1 ? 0 : 1, borderBottomColor: "#E4E8EF", borderTopLeftRadius: i === 0 ? 14 : 0, borderTopRightRadius: i === 0 ? 14 : 0, borderBottomLeftRadius: i === opts.length - 1 ? 14 : 0, borderBottomRightRadius: i === opts.length - 1 ? 14 : 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}><Text style={{ fontWeight: "800", color: "#17243A" }}>{x.title}</Text><Text style={{ color: "#788397", fontSize: 11, marginTop: 3 }}>{x.subtitle}</Text></View><Ionicons name="chevron-forward" size={17} color="#788397" />
      </Pressable>)}
      {mine.length > 0 ? <><Text style={{ fontSize: 18, fontWeight: "900", color: "#17243A", marginTop: 24, marginBottom: 12 }}>Your listings</Text><View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>{mine.map(item => <ListingCard key={item.id} item={item} saved={savedIds.includes(item.id)} onSave={() => toggleSaved(item.id)} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })} />)}</View></> : null}
      {saved.length > 0 ? <><Text style={{ fontSize: 18, fontWeight: "900", color: "#17243A", marginTop: 24, marginBottom: 12 }}>Saved items</Text><View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>{saved.map(item => <ListingCard key={item.id} item={item} saved onSave={() => toggleSaved(item.id)} onPress={() => router.push({ pathname: "/listing/[id]", params: { id: item.id } })} />)}</View></> : null}
    </ScrollView>
  );
}