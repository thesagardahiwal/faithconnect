
import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomSafeAreaView = ({ children }: { children: React.ReactNode }) => {
    const { isDark } = useTheme()
    return (
        <SafeAreaView
        style={{ flex: 1, backgroundColor: isDark ? 'black' : 'white' }}
        edges={['top', 'bottom']}>
            <StatusBar style="auto"/>
            {children}
        </SafeAreaView>
    );
};

export default CustomSafeAreaView;