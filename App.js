import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('Chargement du token...');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      return 'ERREUR: Utilise un vrai téléphone';
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return 'ERREUR: Permission refusée';
    }

    const projectId = Constants.expoConfig.extra.eas.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    
    return token;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Alerte Gouv Test
      </Text>
      <Text selectable style={{ fontSize: 12, textAlign: 'center' }}>
        Token: {expoPushToken}
      </Text>
    </View>
  );
}
