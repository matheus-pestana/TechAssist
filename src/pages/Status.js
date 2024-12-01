import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function NotificationScreen() {
  const [userName, setUserName] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Obtém os dados do usuário
      const userRef = doc(db, 'usuarios', user.uid);
      const unsubscribeUser = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserName(userData.nome || 'Fulano da Silva');
        }
      });

      // Escuta as alterações no pedido do usuário
      const ordersRef = doc(db, 'pedidos', user.uid); // Ajuste conforme a estrutura do seu Firestore
      const unsubscribeOrders = onSnapshot(ordersRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const orderData = docSnapshot.data();
          setOrderStatus(orderData.status || 'Status indefinido');
        }
        setLoading(false);
      });

      // Limpar os listeners quando o componente for desmontado
      return () => {
        unsubscribeUser();
        unsubscribeOrders();
      };
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {userName}!</Text>
      <Text style={styles.orderStatus}>Status Atual do Pedido: {orderStatus}</Text>

      <Button
        title="Ver Detalhes do Pedido"
        onPress={() => alert('Detalhes do pedido (em breve)')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272727',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  orderStatus: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  loading: {
    fontSize: 20,
    color: 'white',
  },
});
