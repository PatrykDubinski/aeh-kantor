import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../src/auth/AuthContext';

export default function Index() {
    const { authenticated } = useContext(AuthContext);

    if (authenticated) {
        return <Redirect href="/(tabs)/dashboard" />;
    }

    return <Redirect href="/(auth)/login" />;
}
