import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDatabaseInitialization } from '@/hooks/use-database-initialization';

const GirlyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF80AB',
    background: '#FFF5F8',
    card: '#FFB7CE',
    text: '#D81B60',
    border: '#FF80AB',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isReady: isDatabaseReady, error: databaseError } = useDatabaseInitialization();

  if (databaseError) {
    console.error('Database initialization error:', databaseError);
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : GirlyTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFB7CE' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* 1. Point to the (tabs) folder to enable the bottom bar */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        
        {/* 2. Keep these outside as full-screen modals/pages */}
        <Stack.Screen name="details" options={{ title: 'Edit Note ✏️' }} />
        <Stack.Screen 
          name="add" 
          options={{ 
            presentation: 'modal', 
            title: 'New Notes'
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}