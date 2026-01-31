import { TextInput, TouchableOpacity, StyleSheet, Alert, View } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../../src/auth/AuthContext";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "react-i18next";

export default function RegisterScreen() {
    const { register } = useContext(AuthContext);
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [baseCurrency, setBaseCurrency] = useState("PLN");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert(t('error'), t('fill_all_fields'));
            return;
        }
        setLoading(true);
        try {
            await register(email, password, baseCurrency);
            Alert.alert(t('success'), t('account_created'));
            router.replace("/login");
        } catch (error: any) {
            Alert.alert(t('error'), error.response?.data?.errors?.join(", ") || t('registration_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>{t('register')}</ThemedText>
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

                <ThemedView style={styles.currencyContainer}>
                    <ThemedText>{t('base_currency')}: </ThemedText>
                    <View style={styles.chips}>
                        {['PLN', 'USD', 'EUR'].map((curr) => (
                            <TouchableOpacity
                                key={curr}
                                onPress={() => setBaseCurrency(curr)}
                                style={[styles.chip, baseCurrency === curr && styles.activeChip]}
                            >
                                <ThemedText style={baseCurrency === curr && styles.activeChipText}>{curr}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ThemedView>

                <TouchableOpacity
                    style={[styles.button, loading && styles.disabledButton]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <ThemedText style={styles.buttonText}>
                        {loading ? t('creating') : t('register')}
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/login")}>
                    <ThemedText style={styles.link}>{t('already_have_account')}</ThemedText>
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
    },
    currencyContainer: {
        flexDirection: 'column',
        gap: 10,
        backgroundColor: 'transparent',
    },
    chips: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    activeChip: {
        backgroundColor: '#007AFF',
    },
    activeChipText: {
        color: '#fff',
    }
});
