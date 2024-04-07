import { Credential } from "@/components/credential";
import { Header } from "@/components/header";
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View, Modal, Share } from "react-native";
import { FontAwesome } from "@expo/vector-icons"
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker"
import { QRCode } from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store"
import { Redirect } from "expo-router";
import { MotiView } from "moti";


export default function Ticket() {
    const [image, useImage] = useState("")
    const [expandQRCode, setExpandQRCode] = useState(false)
    const badgeStore = useBadgeStore()

    async function handleShare() {
        try {
            if (badgeStore.data?.checkInURL) {
                console.log(badgeStore.data?.checkInURL)
                await Share.share({
                    message: badgeStore.data.checkInURL
                })
            }

        } catch (error) {
            console.log(error)
            Alert.alert("Compartilhar", "Não foi possível compartilhar")
        }
    }
    async function handleSelectImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
            })

            if (result.assets) {
                badgeStore.updateAvatar(result.assets[0].uri)
            }
        } catch (error) {
            console.log(error)
            Alert.alert("Foto", "Erro na foto")
        }
    }
    if (!badgeStore.data?.checkInURL) {
        return <Redirect href="/" />
    }
    return (
        <View className="flex-1 bg-green-500">
            <StatusBar barStyle="light-content" />
            <Header title="Minha Credencial" />
            <ScrollView className="-mt-28 -z-10" contentContainerClassName="px-8 pb-8">
                <Credential

                    data={badgeStore.data}
                    onChangeAvatar={handleSelectImage}
                    onShowQRCode={() => setExpandQRCode(true)}

                />
                <MotiView
                from={{
                    translateY:0
                }}
                animate={{
                    translateY:10
                }}
                transition={{
                    loop: true,
                    type: "timing",
                    duration: 700
                }}
                >

                    <FontAwesome
                        name="angle-double-down"
                        color={colors.gray[300]}
                        size={24}
                        className="self-center my-6"
                    />
                </MotiView>

                <Text className="text-white font-bold text-2xl mt-4" >
                    Compartilhar credencial
                </Text>

                <Text className="text-white font-regular text-base mt-1 mb-6">
                    Mostre ao mundo que você vai participar do {badgeStore.data.eventTItle}
                </Text>

                <Button title="Compartilhar" onPress={handleShare} />

                <TouchableOpacity activeOpacity={0.7} className="mt-10" onPress={() => badgeStore.remove()}>
                    <Text className="text-base text-white font-bold text-center mt-10">
                        Remover Ingresso
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={expandQRCode} statusBarTranslucent animationType="slide">
                <View className="flex-1 bg-green-500 items-center justify-center">

                    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpandQRCode(false)}>
                        <QRCode value="teste" size={300} />
                        <Text className="text-2xl  text-orange-500 font-bold text-center mt-10"> Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}