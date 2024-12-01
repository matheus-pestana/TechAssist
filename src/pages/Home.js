import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState('');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    console.error('Usuário não autenticado');
                    setUserName('(Erro ao obter nome)');
                    setOrders([]); // Garante que não tenha pedidos carregados se o usuário não estiver autenticado
                    return;
                }

                console.log('UID do usuário logado:', user.uid);

                // Buscar nome do usuário
                const userRef = doc(db, 'usuarios', user.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setUserName(userData.nome || 'Usuário Anônimo'); // Exibe o nome ou um valor padrão
                } else {
                    console.error('Documento do usuário não encontrado no Firestore');
                    setUserName('(Nome não encontrado)');
                }

                // Agora que temos o nome, vamos buscar os pedidos
                const ordersCollection = collection(db, 'pedidos');
                const q = query(ordersCollection, where('emailCliente', '==', user.email)); // Verifica se o campo "emailClientew" corresponde ao email do usuário
                const ordersSnapshot = await getDocs(q);

                const ordersList = ordersSnapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data(), // Obtendo os dados do documento
                    };
                });

                console.log('Pedidos encontrados:', ordersList);

                setOrders(ordersList); // Atualiza o estado com os pedidos filtrados
            } catch (error) {
                console.error('Erro ao buscar dados: ', error);
                setUserName('(Erro ao obter nome)');
                setOrders([]); // Em caso de erro, limpa os pedidos
            }
        };

        fetchData();
    }, []);

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString(); // Formata a data no padrão local
        }
        return 'Data não disponível';
    };

    const renderOrderStatusIcons = (status) => {
        const statusSteps = [
            { name: "analise", icon: "checkmark-circle", label: "Em Análise" },
            { name: "manutencao", icon: "construct-outline", label: "Em Manutenção" },
            { name: "finalizado", icon: "checkmark-done-outline", label: "Finalizado" },
        ];

        const getStatusColor = (currentStatus, stepName) => {
            if (currentStatus === stepName) return "#00FF00"; // Verde para o status atual
            const stepIndex = statusSteps.findIndex((step) => step.name === stepName);
            const currentIndex = statusSteps.findIndex((step) => step.name === currentStatus);

            return stepIndex <= currentIndex ? "#00FF00" : "white"; // Verde para concluídos, branco para pendentes
        };

        return (
            <View style={styles.statusIconsContainer}>
                {statusSteps.map((step, index) => (
                    <View key={index} style={styles.statusIconContainer}>
                        <Ionicons
                            name={step.icon}
                            size={28}
                            color={getStatusColor(status, step.name)}
                        />
                        <Text style={styles.statusText}>{step.label}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderOrderItem = ({ item }) => {
        return (
            <View style={styles.orderItem}>
                <Text style={styles.deviceName}>Aparelho: {item.aparelho}</Text>
                <Text style={styles.requestDate}>
                    Data da solicitação: {formatDate(item.dataSolicitacao)}
                </Text>
                {renderOrderStatusIcons(item.status)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <FlatList
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.title}>Página Inicial</Text>
                            <Image
                                style={styles.logo}
                                source={require('../assets/simbolo.png')}
                            />
                        </View>

                        <Text style={styles.greeting}>Olá {userName}!</Text>

                        <View style={styles.welcomeCard}>
                            <Text style={styles.welcomeTitle}>Bem-vindo(a)</Text>
                            <Text style={styles.welcomeSubtitle}>
                                No momento a nossa assistência está: <Text style={styles.statusOpen}>Aberta</Text>
                            </Text>
                            <TouchableOpacity style={styles.locationButton}>
                                <Text style={styles.locationButtonText}>Localização →</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>Status atual do seu pedido:</Text>
                    </>
                }
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: 50,
    },
    safearea: {
        flex: 1,
        backgroundColor: '#272727',
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00FF00',
    },
    greeting: {
        fontSize: 18,
        color: 'white',
        marginBottom: 20,
    },
    welcomeCard: {
        backgroundColor: '#2A7B4D',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'white',
    },
    statusOpen: {
        fontWeight: 'bold',
        color: '#00FF00',
    },
    locationButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#1C1C1C',
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    locationButtonText: {
        color: '#00FF00',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
    },
    orderCard: {
        backgroundColor: '#2A7B4D',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    orderItem: {
        backgroundColor: '#2A7B4D',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    requestDate: {
        fontSize: 14,
        color: 'white',
    },
    statusText: {
        fontSize: 14,
        color: 'white',
        marginTop: 5,
    },
    statusIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    statusIconContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        marginTop: 5,
    },
});
