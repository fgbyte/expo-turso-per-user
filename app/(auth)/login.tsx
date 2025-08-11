import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import {
    Platform,
    View,
} from 'react-native'
import { Text } from '~/components/ui/text'
import { Button } from '~/components/ui/button';
import AntDesign from '@expo/vector-icons/AntDesign';


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
            <svg
                viewBox="0 0 201 170"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-28 text-aquamarine"
                aria-hidden="true"
            ><path
                d="M200.035 48.61C195.365 20.67 170.875 0 170.875 0V30.78L156.335 34.53L147.225 23.56L142.415 33.02C132.495 30.32 118.835 28.58 100.045 28.58C81.2549 28.58 67.5949 30.33 57.6749 33.02L52.8649 23.56L43.7549 34.53L29.2149 30.78V0C29.2149 0 4.72493 20.67 0.0549316 48.61L32.1949 59.73C33.2449 79.16 41.9849 131.61 44.4849 136.37C47.1449 141.44 61.2649 155.93 72.3149 161.5C72.3149 161.5 76.3149 157.27 78.7549 153.54C81.8549 157.19 97.8649 169.99 100.055 169.99C102.245 169.99 118.255 157.2 121.355 153.54C123.795 157.27 127.795 161.5 127.795 161.5C138.845 155.93 152.965 141.44 155.625 136.37C158.125 131.61 166.865 79.16 167.915 59.73L200.055 48.61H200.035ZM153.845 93.35L132.095 95.29L134.005 121.96C134.005 121.96 120.775 132.91 100.045 132.91C79.3149 132.91 66.0849 121.96 66.0849 121.96L67.9949 95.29L46.2449 93.35L42.5249 63.31L78.5749 75.79L75.7749 113.18C82.4749 114.88 89.5249 116.57 100.055 116.57C110.585 116.57 117.625 114.88 124.325 113.18L121.525 75.79L157.575 63.31L153.855 93.35H153.845Z"
                fill="currentColor"
            ></path>
            </svg>
            <Text className="text-5xl font-black text-center tracking-tight">
                Turso Per User Starter
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
