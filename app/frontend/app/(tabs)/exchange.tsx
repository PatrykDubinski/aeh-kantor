import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert, useColorScheme, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../src/api/axiosClient";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function ExchangeScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() ?? 'light';
    const [currency, setCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [direction, setDirection] = useState<"buy" | "sell">("buy");
    const [rates, setRates] = useState<any[]>([]);
    const [loadingRates, setLoadingRates] = useState(true);

    useEffect(() => {
        api.get("/rates")
            .then(res => {
                setRates(res.data.rates);
                if (res.data.rates.length > 0 && !currency) {
                    setCurrency(res.data.rates[0].code);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingRates(false));
    }, []);

    const executeTransaction = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert(t('error'), t('invalid_amount'));
            return;
        }

        try {
            await api.post("/transactions", {
                currency: currency,
                amount: Number(amount),
                direction: direction,
            });
            Alert.alert(t('success'), t('exchange_success'));
            setAmount("");
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || t('exchange_failed');
            Alert.alert(t('error'), errorMsg);
        }
    };

    const currentRate = rates.find(r => r.code === currency)?.rate || 0;

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.title}>{t('exchange')}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.content}>
                {/* Transaction Type Toggle */}
                <View style={[styles.card, colorScheme === 'dark' && styles.darkCard, styles.shadow]}>
                    <ThemedText style={styles.label}>{t('transaction_type')}</ThemedText>
                    <View style={styles.directionContainer}>
                        <TouchableOpacity
                            style={[
                                styles.directionButton,
                                direction === "buy" && styles.activeBuyButton
                            ]}
                            onPress={() => setDirection("buy")}
                        >
                            <Text style={[
                                styles.directionButtonText,
                                direction === "buy" && styles.activeButtonText
                            ]}>{t('buy')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.directionButton,
                                direction === "sell" && styles.activeSellButton
                            ]}
                            onPress={() => setDirection("sell")}
                        >
                            <Text style={[
                                styles.directionButtonText,
                                direction === "sell" && styles.activeButtonText
                            ]}>{t('sell')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Currency Selector */}
                <View style={[styles.card, colorScheme === 'dark' && styles.darkCard, styles.shadow]}>
                    <ThemedText style={styles.label}>{t('select_currency')}</ThemedText>
                    {loadingRates ? (
                        <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyList}>
                            {rates.map((rate) => (
                                <TouchableOpacity
                                    key={rate.code}
                                    onPress={() => setCurrency(rate.code)}
                                    style={[
                                        styles.currencyChip,
                                        currency === rate.code && styles.activeCurrencyChip,
                                        colorScheme === 'dark' && styles.darkCurrencyChip,
                                        currency === rate.code && colorScheme === 'dark' && styles.activeCurrencyChipDark
                                    ]}
                                >
                                    <ThemedText style={[
                                        styles.currencyText,
                                        currency === rate.code && styles.activeCurrencyText
                                    ]}>{rate.code}</ThemedText>
                                    <Text style={styles.rateSmall}>{parseFloat(rate.rate).toFixed(2)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Amount Input */}
                <View style={[styles.card, colorScheme === 'dark' && styles.darkCard, styles.shadow]}>
                    <ThemedText style={styles.label}>{t('amount')}</ThemedText>
                    <View style={[
                        styles.inputWrapper,
                        colorScheme === 'dark' && styles.darkInputWrapper
                    ]}>
                        <TextInput
                            style={[
                                styles.input,
                                { color: Colors[colorScheme].text }
                            ]}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor={colorScheme === 'dark' ? '#687076' : '#999'}

                        />
                        <View style={styles.currencySuffix}>
                            <ThemedText style={styles.suffixText}>{currency}</ThemedText>
                        </View>
                    </View>

                    {amount && !isNaN(Number(amount)) && (
                        <View style={styles.summaryContainer}>
                            <ThemedText style={styles.summaryLabel}>
                                {direction === 'buy' ? t('total_cost') : t('total_received')}
                            </ThemedText>
                            <ThemedText style={styles.summaryValue}>
                                {(Number(amount) * currentRate).toFixed(2)} PLN
                            </ThemedText>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        direction === 'buy' ? styles.buySubmit : styles.sellSubmit
                    ]}
                    onPress={executeTransaction}
                >
                    <Text style={styles.submitButtonText}>{t('confirm_exchange')}</Text>
                </TouchableOpacity>
            </ThemedView>
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
    content: {
        padding: 20,
        gap: 20,
    },
    card: {
        padding: 16,
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
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#6c757d',
        textTransform: 'uppercase',
    },
    directionContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    directionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
    },
    activeBuyButton: {
        backgroundColor: '#28a745',
        borderColor: '#28a745',
    },
    activeSellButton: {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
    },
    directionButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeButtonText: {
        color: 'white',
    },
    currencyList: {
        flexDirection: 'row',
    },
    currencyChip: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        marginRight: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    darkCurrencyChip: {
        backgroundColor: '#2d333b',
    },
    activeCurrencyChip: {
        borderColor: '#007AFF',
        backgroundColor: '#e7f1ff',
    },
    activeCurrencyChipDark: {
        borderColor: '#007AFF',
        backgroundColor: '#1a365d',
    },
    currencyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    activeCurrencyText: {
        color: '#007AFF',
    },
    rateSmall: {
        fontSize: 10,
        color: '#6c757d',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    darkInputWrapper: {
        backgroundColor: '#2d333b',
        borderColor: '#444',
    },
    input: {
        flex: 1,
        height: 60,
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10,
        paddingRight: 0,
        maxWidth: 280
    },
    currencySuffix: {
        paddingLeft: 10,
    },
    suffixText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6c757d',
    },
    summaryContainer: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6c757d',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    submitButton: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buySubmit: {
        backgroundColor: '#28a745',
    },
    sellSubmit: {
        backgroundColor: '#dc3545',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    }
});
