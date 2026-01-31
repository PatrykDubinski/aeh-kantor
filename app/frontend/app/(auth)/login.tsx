import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../src/auth/AuthContext";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
    const { login } = useContext(AuthContext);
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t('error'), t('fill_all_fields'));
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            router.replace("/(tabs)/dashboard");
        } catch (error: any) {
            Alert.alert(t('error'), error.response?.data?.error || t('login_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>{t('welcome_back')}</ThemedText>
            <ThemedView style={styles.form}>
                <ThemedText>{t('email')}</ThemedText>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder={t('email')}
                />

                <ThemedText>{t('password')}</ThemedText>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t('password')}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <ThemedText style={styles.buttonText}>
                        {loading ? t('logging_in') : t('login')}
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/register")}>
                    <ThemedText style={styles.link}>{t('no_account_register')}</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 40,
    },
    form: {
        gap: 15,
        backgroundColor: 'transparent',
    },
    input: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    link: {
        textAlign: 'center',
        color: '#007AFF',
        marginTop: 15,
    }
});
