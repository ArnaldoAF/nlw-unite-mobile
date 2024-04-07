import {View, Image, TextInputProps, StatusBar, Alert, Text} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Link, Redirect } from 'expo-router'

import { Input } from '@/components/input'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { useState } from 'react'
import {useBadgeStore} from "@/store/badge-store"

import {api} from "@/server/api"

export default function Home() {
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const badgeStore = useBadgeStore()

    async function handleAccessCredential() {
        try {
            if(!code.trim()) {
                return Alert.alert("Credencial", "Informe o código")
            }

            setIsLoading(true)
            const { data } = await api.get(`/attendees/${code}/badge`)
            badgeStore.save(data.badge)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            Alert.alert("Ingresso", "Ingresso não encontrado")

        } 
    }

    if(badgeStore.data?.checkInURL) {
        return <Redirect href="/ticket"/>
    }

    
    return (
        <View className="flex-1 bg-green-500 items-center justify-center">
            <StatusBar barStyle="light-content" />

            <Image source={require("@/assets/logo.png")} className="h-16" resizeMode='contain' />
            

            <View className="w-full mt-12 gap-3">
                <Input>
                    <MaterialCommunityIcons name="ticket-confirmation-outline" size={20} color={colors.green[200]} />
                    <Input.Field 
                        placeholder='Còdigo do ingresso' 
                        onChangeText={setCode}/>
                </Input>

                <Button 
                    title="Acessar credencial" 
                    onPress={handleAccessCredential} 
                    isLoading={isLoading} 
                    disabled={isLoading}/>
                <Text>

                {code}
                </Text>

                <Link href="/register" className='text-gray-100 text-base font-bold text-center mt-8'>
                    Ainda não possui ingresso?
                </Link>
            </View>
        </View>
    )
}

