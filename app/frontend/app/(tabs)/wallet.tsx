import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, View, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import api from "../../src/api/axiosClient";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function WalletScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWallets = async () => {
        try {
            const res = await api.get("/wallet");
            setWallets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWallets();
        }, [])
    );

    if (loading) {
        return (
            <ThemedView style={styles.center}>
                <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
            </ThemedView>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.title}>{t('wallet')}</ThemedText>
            </ThemedView>

            <View style={styles.listContainer}>
                {wallets.length === 0 ? (
                    <ThemedText style={styles.emptyText}>{t('no_wallets')}</ThemedText>
                ) : (
                    wallets.map((w) => (
                        <ThemedView
                            key={w.currency}
                            style={[
                                styles.walletCard,
                                styles.shadow,
                                colorScheme === 'dark' && styles.darkCard
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <ThemedText
                                    type="subtitle"
                                    style={[
                                        styles.currencyCode,
                                        { color: Colors[colorScheme].text }
                                    ]}
                                >
                                    {w.currency}
                                </ThemedText>
                                <View style={[styles.badge, colorScheme === 'dark' && styles.darkBadge]}>
                                    <ThemedText style={[styles.badgeText, colorScheme === 'dark' && styles.darkBadgeText]}>
                                        {t('balance')}
                                    </ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.amount}>
                                {Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <ThemedText style={[styles.currencyLabel, colorScheme === 'dark' && { color: '#9BA1A6' }]}> {w.currency}</ThemedText>
                            </ThemedText>
                        </ThemedView>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
    },
    listContainer: {
        padding: 20,
        gap: 15,
    },
    walletCard: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f1f3f5',
    },
    darkCard: {
        backgroundColor: '#1c1e21',
        borderColor: '#2d333b',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    currencyCode: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    amount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    currencyLabel: {
        fontSize: 18,
        color: '#6c757d',
        fontWeight: '500',
    },
    badge: {
        backgroundColor: '#e7f1ff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    darkBadge: {
        backgroundColor: '#004a99',
    },
    badgeText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    darkBadgeText: {
        color: '#80bfff',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 18,
        color: '#6c757d',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
