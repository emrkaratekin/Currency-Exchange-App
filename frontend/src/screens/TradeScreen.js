import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import rateService from '../services/rateService';
import transactionService from '../services/transactionService';
import walletService from '../services/walletService';
import { getCurrencyFlag } from '../utils/currencyUtils';

export default function TradeScreen() {
  const [rates, setRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState('BUY');
  const [loading, setLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [plnBalance, setPlnBalance] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [ratesResult, walletsResult] = await Promise.all([
        rateService.getRates(),
        walletService.getWallets()
      ]);

      const uniqueRates = Array.from(new Map(ratesResult.data.map(item => [item.currency, item])).values());
      setRates(uniqueRates);
      setIsStale(ratesResult.isStale);

      const plnWallet = walletsResult.find(w => w.currency === 'PLN');
      setPlnBalance(plnWallet ? parseFloat(plnWallet.balance) : 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const getCurrentRate = () => {
    const rate = rates.find(r => r.currency === selectedCurrency);
    return rate ? rate.rate : 0;
  };

  const calculateTotal = () => {
    const rate = getCurrentRate();
    const qty = parseFloat(amount) || 0;
    return (qty * rate).toFixed(2);
  };

  const executeTrade = async (qty) => {
    setLoading(true);
    try {
      await transactionService.executeTransaction(tradeType, selectedCurrency, qty);
      Alert.alert('Success', `${tradeType === 'BUY' ? 'Bought' : 'Sold'} ${qty} ${selectedCurrency}`);
      setAmount('');
      // Refresh balance immediately after successful trade
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (isStale) {
      Alert.alert('Error', 'Cannot trade with stale rates. Please refresh.');
      return;
    }
    const qty = parseFloat(amount);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (Platform.OS === 'web') {
       if (window.confirm(`Are you sure you want to ${tradeType} ${qty} ${selectedCurrency} for ${calculateTotal()} PLN?`)) {
         executeTrade(qty);
       }
    } else {
      Alert.alert(
        'Confirm Transaction',
        `Are you sure you want to ${tradeType} ${qty} ${selectedCurrency} for ${calculateTotal()} PLN?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => executeTrade(qty),
          },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trade Currency</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Your Balance: {plnBalance.toFixed(2)} PLN</Text>
      </View>

      {isStale && (
        <View style={styles.staleWarning}>
          <Text style={styles.staleText}>⚠️ Trading disabled - rates outdated</Text>
        </View>
      )}

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, tradeType === 'BUY' && styles.toggleActive]}
          onPress={() => setTradeType('BUY')}
        >
          <Text style={[styles.toggleText, tradeType === 'BUY' && styles.toggleTextActive]}>BUY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, tradeType === 'SELL' && styles.toggleActive]}
          onPress={() => setTradeType('SELL')}
        >
          <Text style={[styles.toggleText, tradeType === 'SELL' && styles.toggleTextActive]}>SELL</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Currency</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={setSelectedCurrency}
          style={styles.picker}
        >
          {rates.map(rate => (
            <Picker.Item key={rate.currency} label={`${getCurrencyFlag(rate.currency)} ${rate.currency} - ${rate.rate.toFixed(4)} PLN`} value={rate.currency} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Amount ({selectedCurrency})</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>
          {tradeType === 'BUY' ? 'You pay:' : 'You receive:'}
        </Text>
        <Text style={styles.summaryValue}>{calculateTotal()} PLN</Text>
      </View>

      <TouchableOpacity
        style={[styles.tradeButton, tradeType === 'SELL' && styles.sellButton, isStale && styles.disabledButton]}
        onPress={handleTrade}
        disabled={loading || isStale}
      >
        <Text style={styles.tradeButtonText}>
          {loading ? 'Processing...' : `${tradeType} ${selectedCurrency}`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  balanceContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  balanceText: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  staleWarning: { backgroundColor: '#ffcdd2', padding: 10, borderRadius: 8, marginBottom: 15 },
  staleText: { color: '#c62828', textAlign: 'center' },
  toggleContainer: { flexDirection: 'row', marginBottom: 20 },
  toggleButton: { flex: 1, padding: 15, backgroundColor: '#ddd', alignItems: 'center', borderRadius: 10, marginHorizontal: 5 },
  toggleActive: { backgroundColor: '#2196F3' },
  toggleText: { fontSize: 16, fontWeight: 'bold', color: '#666' },
  toggleTextActive: { color: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 20 },
  picker: { height: 50 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  summary: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 24, fontWeight: 'bold', color: '#2196F3' },
  tradeButton: { backgroundColor: '#4CAF50', padding: 20, borderRadius: 10, alignItems: 'center' },
  sellButton: { backgroundColor: '#f44336' },
  disabledButton: { backgroundColor: '#ccc' },
  tradeButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
