import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import rateService from '../services/rateService';
import { getCurrencyFlag } from '../utils/currencyUtils';

export default function HomeScreen() {
  const [rates, setRates] = useState([]);
  const [isStale, setIsStale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    try {
      const result = await rateService.getRates();
      const uniqueRates = Array.from(new Map(result.data.map(item => [item.currency, item])).values());
      setRates(uniqueRates);
      setIsStale(result.isStale);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRates();
    }, [fetchRates])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRates();
  };

  const renderRate = ({ item }) => (
    <View style={styles.rateCard}>
      <Text style={styles.flag}>{getCurrencyFlag(item.currency)}</Text>
      <View style={styles.rateInfo}>
        <Text style={styles.currency}>{item.currency}</Text>
        <Text style={styles.rateValue}>{item.rate.toFixed(4)} PLN</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading rates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exchange Rates</Text>
      {isStale && (
        <View style={styles.staleWarning}>
          <Text style={styles.staleText}>⚠️ Rates may be outdated (offline mode)</Text>
        </View>
      )}
      <FlatList
        data={rates}
        keyExtractor={(item) => item.currency}
        renderItem={renderRate}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  staleWarning: { backgroundColor: '#fff3cd', padding: 10, borderRadius: 8, marginBottom: 15 },
  staleText: { color: '#856404', textAlign: 'center' },
  list: { paddingBottom: 20 },
  rateCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  flag: { fontSize: 40, marginRight: 15 },
  rateInfo: { flex: 1 },
  currency: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  rateValue: { fontSize: 16, color: '#2196F3', marginTop: 5 },
});
