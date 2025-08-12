import { Slot, Stack } from "expo-router";
import { View } from "react-native";
import ClerkUserButton from "~/components/clerkUserButton.web";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";

export default function DashboardLayout() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerLeft: () => (
                        <View className='flex-row items-center p-4'>
                            <Text className='text-3xl font-bold'>Tasks</Text>
                            <ThemeToggle />
                        </View>

                    ),
                    headerRight: () => <ClerkUserButton />,
                }}
            />
            <View className='px-4 py-6'>
                <Slot />
            </View>
        </>
    );
}