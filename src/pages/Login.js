import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        // Verifica se o usuário já está autenticado quando o componente é montado
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.navigate('Home');  // Se o usuário já estiver logado, redireciona para a tela Home
            }
        });

        return () => unsubscribe();  // Limpa a assinatura quando o componente for desmontado
    }, [navigation]);

    const handleLogin = async () => {
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, senha);  // Realiza o login com o Firebase
            Alert.alert('Login bem-sucedido!');
            navigation.navigate('Home');  // Redireciona para a tela Home após login bem-sucedido
        } catch (error) {
            console.error('Erro no login: ', error);
            Alert.alert('Erro', 'Não foi possível realizar o login. Verifique suas credenciais.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('Welcome')}>
                    <Ionicons name="arrow-back" size={36} color="#2A7B4D" />
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
                <Text style={styles.headerText}>Login do usuário</Text>
            </View>

            <View style={styles.inputs}>
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor='white'
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Senha'
                    placeholderTextColor='white'
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.senhaButton} onPress={() => navigation.navigate('Senha')}>
                    <Text style={styles.senhaText}>Esqueci a senha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logarButton} onPress={handleLogin}>
                    <Text style={styles.logarText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
        gap: 40,
    },
    backContainer: {
        margin: 10,
        width: '55px',
    },
    back: {
        borderRadius: 999,
        backgroundColor: '#373737',
        padding: 10,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 350,
        height: 150,
        resizeMode: 'contain',
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputs: {
        flex: 1,
        alignItems: 'center',
        gap: 20,
    },
    input: {
        width: '90%',
        height: 50,
        borderRadius: 30,
        paddingLeft: 20,
        backgroundColor: '#343434',
        color: 'white',
    },
    senhaButton: {
        width: '90%',
        margin: 10,
    },
    senhaText: {
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#2A7B4D',
    },
    logarButton: {
        width: '90%',
        height: 50,
        borderRadius: 30,
        backgroundColor: '#2A7B4D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logarText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
