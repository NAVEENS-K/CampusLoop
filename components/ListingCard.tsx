import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Listing } from "@/data/listings";

export function ListingCard({
  item, onPress, saved = false, onSave,
}: {
  item: Listing; onPress: () => void; saved?: boolean; onSave?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ width: "48.5%", backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: "#E4E8EF", overflow: "hidden", marginBottom: 13 }}>
      <View style={{ height: 132, backgroundColor: item.accent, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 50 }}>{item.emoji}</Text>
        {onSave ? <Pressable accessibilityRole="button" accessibilityLabel={saved ? "Remove from saved items" : "Save item"} onPress={(event) => { event.stopPropagation(); onSave(); }} style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: "#FFFFFFE8", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name={saved ? "heart" : "heart-outline"} size={18} color={saved ? "#D64055" : "#17243A"} />
        </Pressable> : null}
      </View>
      <View style={{ padding: 12 }}>
        <Text numberOfLines={2} style={{ fontSize: 13, lineHeight: 18, fontWeight: "800", color: "#17243A", minHeight: 38 }}>{item.title}</Text>
        <Text style={{ fontSize: 18, fontWeight: "900", color: "#17243A", marginTop: 7 }}>₹{item.price.toLocaleString("en-IN")}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7, gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#237A4B" }} />
          <Text style={{ fontSize: 11, color: "#237A4B", fontWeight: "700" }}>{item.condition}</Text>
        </View>
        <Text numberOfLines={1} style={{ color: "#788397", fontSize: 10, marginTop: 5 }}>{item.location}</Text>
      </View>
    </Pressable>
  );
}