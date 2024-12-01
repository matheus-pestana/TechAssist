import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig.js'; // Importe o Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default function Cadastro({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const handleCadastro = async () => {
        if (!nome || !email || !senha || !confirmaSenha) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        if (senha !== confirmaSenha) {
            Alert.alert("Erro", "As senhas não conferem.");
            return;
        }

        try {
            // Cadastrar o usuário com o Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Atualizar o displayName do usuário
            await updateProfile(user, {
                displayName: nome,  // Define o nome de exibição
            });

            // Salvar dados adicionais no Firestore
            await setDoc(doc(db, "usuarios", user.uid), {
                nome: nome,
                email: email,
                criadoEm: new Date(),
            });

            Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
            navigation.navigate('Login'); // Navegar para a tela de Login
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.backContainer}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack(null)}>
                    <Ionicons name="arrow-back" size={36} color="#2A7B4D" />
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
                <Text style={styles.headerText}>Cadastro do usuário</Text>
            </View>

            <View style={styles.inputs}>

                <TextInput
                    style={styles.input}
                    placeholder='Nome completo'
                    placeholderTextColor='white'
                    value={nome}
                    onChangeText={setNome}
                />
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
                <TextInput
                    style={styles.input}
                    placeholder='Confirme sua senha'
                    placeholderTextColor='white'
                    value={confirmaSenha}
                    onChangeText={setConfirmaSenha}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
        gap: 20,
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
        marginBottom: 10,
        backgroundColor: '#343434',
        color: 'white',
    },

    button: {
        width: '90%',
        height: 50,
        borderRadius: 30,
        backgroundColor: '#2A7B4D',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
