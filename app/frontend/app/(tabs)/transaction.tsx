import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, View, TouchableOpacity, TextInput, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import api from "../../src/api/axiosClient";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function TransactionsScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState("");
    const [direction, setDirection] = useState("");

    const fetchTransactions = async () => {
        setLoading(true);
        const params: any = {};
        if (currency) params.currency = currency.toUpperCase();
        if (direction) params.direction = direction;

        try {
            const res = await api.get("/transactions", { params });
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [currency, direction])
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.title}>{t('history')}</ThemedText>
            </ThemedView>

            <View style={styles.filterSection}>
                <TextInput
                    placeholder={t('currency') + " (np. USD)"}
                    placeholderTextColor={colorScheme === 'dark' ? '#687076' : '#999'}
                    value={currency}
                    onChangeText={setCurrency}
                    style={[
                        styles.input,
                        { color: Colors[colorScheme].text },
                        colorScheme === 'dark' && styles.darkInput
                    ]}
                    autoCapitalize="characters"
                />
                <View style={styles.directionFilters}>
                    <TouchableOpacity
                        onPress={() => setDirection(direction === 'buy' ? '' : 'buy')}
                        style={[
                            styles.filterButton,
                            direction === 'buy' && styles.activeBuyFilter,
                            colorScheme === 'dark' && styles.darkFilterButton
                        ]}
                    >
                        <ThemedText style={[
                            styles.filterText,
                            direction === 'buy' && styles.activeFilterText
                        ]}>{t('buy')}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDirection(direction === 'sell' ? '' : 'sell')}
                        style={[
                            styles.filterButton,
                            direction === 'sell' && styles.activeSellFilter,
                            colorScheme === 'dark' && styles.darkFilterButton
                        ]}
                    >
                        <ThemedText style={[
                            styles.filterText,
                            direction === 'sell' && styles.activeFilterText
                        ]}>{t('sell')}</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>

            {loading && transactions.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
                </View>
            ) : transactions.length === 0 ? (
                <ThemedText style={styles.emptyText}>{t('no_transactions')}</ThemedText>
            ) : (
                <View style={styles.listContainer}>
                    {transactions.map((tx: any) => (
                        <ThemedView
                            key={tx.id}
                            style={[
                                styles.transactionCard,
                                styles.shadow,
                                colorScheme === 'dark' && styles.darkCard,
                                { borderLeftColor: tx.direction === 'buy' ? '#28a745' : '#dc3545' }
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.directionBadge}>
                                    <View style={[
                                        styles.dot,
                                        { backgroundColor: tx.direction === 'buy' ? '#28a745' : '#dc3545' }
                                    ]} />
                                    <ThemedText style={[
                                        styles.directionText,
                                        { color: tx.direction === 'buy' ? '#28a745' : '#dc3545' }
                                    ]}>
                                        {tx.direction === 'buy' ? t('buy') : t('sell')}
                                    </ThemedText>
                                </View>
                                <ThemedText style={styles.dateText}>
                                    {new Date(tx.created_at).toLocaleDateString()}
                                </ThemedText>
                            </View>
                            <View style={styles.cardBody}>
                                <ThemedText style={styles.amountText}>
                                    {tx.amount} <ThemedText style={styles.currencySmall}>{tx.currency}</ThemedText>
                                </ThemedText>
                                <View style={styles.rateBadge}>
                                    <ThemedText style={styles.rateText}>
                                        {t('rate')}: {parseFloat(tx.rate).toFixed(4)}
                                    </ThemedText>
                                </View>
                            </View>
                        </ThemedView>
                    ))}
                </View>
            )}
            <View style={{ height: 40 }} />
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
    filterSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        fontSize: 16,
    },
    darkInput: {
        backgroundColor: '#1c1e21',
        borderColor: '#2d333b',
    },
    directionFilters: {
        flexDirection: 'row',
        gap: 10,
    },
    filterButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    darkFilterButton: {
        backgroundColor: '#1c1e21',
        borderColor: '#2d333b',
    },
    activeBuyFilter: {
        borderColor: '#28a745',
        backgroundColor: '#eafaf1',
    },
    activeSellFilter: {
        borderColor: '#dc3545',
        backgroundColor: '#fdf2f2',
    },
    filterText: {
        fontWeight: 'bold',
        color: '#6c757d',
    },
    activeFilterText: {
        color: '#212529',
    },
    listContainer: {
        paddingHorizontal: 20,
        gap: 15,
    },
    transactionCard: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderLeftWidth: 6,
    },
    darkCard: {
        backgroundColor: '#1c1e21',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    directionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    directionText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    dateText: {
        fontSize: 12,
        color: '#6c757d',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    amountText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    currencySmall: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: 'normal',
    },
    rateBadge: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    rateText: {
        fontSize: 12,
        color: '#495057',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#6c757d',
    },
    center: {
        padding: 40,
        alignItems: 'center',
    }
});
