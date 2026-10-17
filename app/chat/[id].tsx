import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, Pressable, View } from "react-native";

type Message = { mine: boolean; text: string };
const initialMessages: Message[] = [
  { mine: false, text: "Hi! Is this item still available?" },
  { mine: true, text: "Yes, it's available." },
  { mine: false, text: "Can we meet near the library?" },
];

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [hydrated, setHydrated] = useState(false);
  const storageKey = `campusloop:chat:v1:${id}`;

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then(raw => {
      if (active && raw) setMessages(JSON.parse(raw) as Message[]);
    }).catch(() => {}).finally(() => { if (active) setHydrated(true); });
    return () => { active = false; };
  }, [storageKey]);

  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(storageKey, JSON.stringify(messages)).catch(() => {});
  }, [hydrated, messages, storageKey]);

  const send = () => {
    const message = text.trim();
    if (!message) return;
    setMessages(old => [...old, { mine: true, text: message }]);
    setText("");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "#F4F5F7", padding: 18, paddingTop: 24 }}>
      <Text onPress={() => router.back()} style={{ color: "#17243A", fontWeight: "800" }}>‹ Back</Text>
      <Text style={{ fontSize: 23, fontWeight: "900", color: "#17243A", marginTop: 16 }}>Campus chat</Text>
      <Text style={{ color: "#788397", marginTop: 4 }}>Conversation #{id}</Text>
      <ScrollView style={{ flex: 1, marginTop: 20 }} contentContainerStyle={{ gap: 12, paddingBottom: 12 }}>
        {messages.map((m, i) => <View key={`${i}-${m.text}`} style={{ alignSelf: m.mine ? "flex-end" : "flex-start", maxWidth: "85%", padding: 13, borderRadius: 16, backgroundColor: m.mine ? "#17243A" : "#fff" }}><Text style={{ color: m.mine ? "#fff" : "#17243A", lineHeight: 20 }}>{m.text}</Text></View>)}
      </ScrollView>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TextInput value={text} onChangeText={setText} onSubmitEditing={send} returnKeyType="send" placeholder="Write a message..." placeholderTextColor="#9AA4B4" style={{ flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E4E8EF", borderRadius: 15, padding: 13, color: "#17243A" }} />
        <Pressable onPress={send} style={{ backgroundColor: "#17243A", borderRadius: 14, padding: 15 }}><Text style={{ color: "#fff", fontWeight: "900" }}>Send</Text></Pressable>
      </View>
      <Text style={{ fontSize: 10, color: "#788397", textAlign: "center", marginTop: 8 }}>Messages are saved on this device only; they are not sent to another user.</Text>
    </KeyboardAvoidingView>
  );
}