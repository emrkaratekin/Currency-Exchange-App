import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import walletService from '../services/walletService';
import { useAuth } from '../context/AuthContext';
import { getCurrencyFlag } from '../utils/currencyUtils';

export default function WalletScreen() {
  const [wallets, setWallets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const { logout, email } = useAuth();

  const fetchWallets = useCallback(async () => {
    try {
      const data = await walletService.getWallets();
      setWallets(data);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWallets();
    }, [fetchWallets])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallets();
  };

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount < 1) {
      Alert.alert('Error', 'Minimum top-up is 1 PLN');
      return;
    }
    try {
      await walletService.topup('PLN', amount);
      setShowTopup(false);
      setTopupAmount('');
      fetchWallets();
      Alert.alert('Success', `Added ${amount} PLN to your wallet`);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Top-up failed');
    }
  };

  const renderWallet = ({ item }) => (
    <View style={styles.walletCard}>
      <Text style={styles.flag}>{getCurrencyFlag(item.currency)}</Text>
      <View style={styles.walletInfo}>
        <Text style={styles.currency}>{item.currency}</Text>
        <Text style={styles.balance}>{parseFloat(item.balance).toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.centered}><Text>Loading wallet...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.currency}
        renderItem={renderWallet}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.topupButton} onPress={() => setShowTopup(true)}>
        <Text style={styles.topupButtonText}>+ Top Up PLN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={showTopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Top Up PLN</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={topupAmount}
              onChangeText={setTopupAmount}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowTopup(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleTopup}>
                <Text style={styles.confirmButtonText}>Top Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 5 },
  list: { paddingBottom: 20 },
  walletCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  flag: { fontSize: 40, marginRight: 15 },
  walletInfo: { flex: 1 },
  currency: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  balance: { fontSize: 20, color: '#4CAF50', marginTop: 5, fontWeight: 'bold' },
  topupButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  topupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#f44336', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { flex: 1, padding: 15, marginRight: 10, borderRadius: 10, backgroundColor: '#ddd', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, color: '#333' },
  confirmButton: { flex: 1, padding: 15, marginLeft: 10, borderRadius: 10, backgroundColor: '#4CAF50', alignItems: 'center' },
  confirmButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});
