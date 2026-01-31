import { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";
import api from "../../src/api/axiosClient";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const CACHE_KEY = "cached_rates";

export default function RatesScreen() {
  const { t } = useTranslation();
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any>(null);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const res = await api.get("/rates");
      setRates(res.data.rates);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(res.data.rates));
    } catch (err) {
      console.error("Failed to fetch rates, loading from cache", err);
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) setRates(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (code: string) => {
    try {
      const res = await api.get(`/rates/history/${code}/7`);
      if (res.data.length > 0) {
        setHistoryData({
          labels: res.data.map((d: any) => d.date.split('-').slice(1).join('/')),
          datasets: [{ data: res.data.map((d: any) => d.rate) }]
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCurrency = (code: string) => {
    if (selectedCurrency === code) {
      setSelectedCurrency(null);
      setHistoryData(null);
    } else {
      setSelectedCurrency(code);
      fetchHistory(code);
    }
  };

  if (loading && rates.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{t('current_rates')}</ThemedText>
      {rates.map((r) => (
        <View key={r.code}>
          <TouchableOpacity onPress={() => handleSelectCurrency(r.code)}>
            <ThemedView style={styles.rateRow}>
              <ThemedText type="defaultSemiBold">{r.code}</ThemedText>
              <ThemedText>{r.currency}</ThemedText>
              <ThemedText type="defaultSemiBold">{r.rate.toFixed(4)} PLN</ThemedText>
            </ThemedView>
          </TouchableOpacity>

          {selectedCurrency === r.code && historyData && (
            <View style={styles.chartContainer}>
              <LineChart
                data={historyData}
                width={Dimensions.get("window").width - 60}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 4,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" }
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  title: {
    marginBottom: 20,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'transparent',
  },
  chartContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
