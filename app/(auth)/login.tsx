import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { Svg, Path } from 'react-native-svg'
import {
    Platform,
    View,
} from 'react-native'
import { Text } from '~/components/ui/text'
import { Button } from '~/components/ui/button';
import AntDesign from '@expo/vector-icons/AntDesign';
import TursoLogo from '~/assets/svg/TursoLogo'


export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Preloads the browser for Android devices to reduce authentication load time
        // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
        if (Platform.OS !== 'web') {
            void WebBrowser.warmUpAsync()
        }
        return () => {
            // Cleanup: closes browser when component unmounts
            if (Platform.OS !== 'web') {
                void WebBrowser.coolDownAsync()
            }
        }
    }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function login() {
    useWarmUpBrowser()

    // Use the `useSSO()` hook to access the `startSSOFlow()` method
    const { startSSOFlow } = useSSO()
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy: 'oauth_google',
            })

            if (setActive && createdSessionId) {
                setActive({ session: createdSessionId })
                router.replace('../(dashboard)')
            }
        } catch (error) {
            console.error('OAuth error:', error)
        }
    }

    return (
        <View className='flex-1 justify-center items-center gap-5 p-6 bg-secondary/90'>
            <TursoLogo width={200} height={200} />

            <Text className="text-5xl font-black text-center tracking-tight">
                Universal Turso Per User Starter
            </Text>
            <Text className="text-lg">
                Database user demo &mdash;{" "}
            </Text>
            <Button variant='outline' onPress={handleGoogleSignIn}>
                <Text className='flex gap-2 items-center'>
                    <AntDesign className='text-black dark:text-white' name="google" size={18} />
                    Continue with Google</Text>
            </Button>
        </View>
    )
}
