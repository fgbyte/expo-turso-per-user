import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-expo/web'
import AntDesign from '@expo/vector-icons/AntDesign'
import { View } from 'react-native'

export default function ClerkUserButton() {
    return (
        <View className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70'>
            <View className='flex-1 aspect-square pt-0.5 justify-center items-start web:px-5'>
                <SignedIn>
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Link labelIcon={<AntDesign name='github' size={16} />} label='Star repository' href='https://github.com/tursodatabase/libsql-expo-starter' />
                        </UserButton.MenuItems>
                    </UserButton>
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </View>
        </View>
    )
}