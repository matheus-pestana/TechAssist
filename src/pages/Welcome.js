import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome({ navigation }) {

    return (

        <View style={styles.container}>

            <View style={styles.techassist}>

                <Image
                    style={styles.logo}
                    source={require('../assets/simbolo.png')}
                />
                <Text style={styles.nome}>Tech Assist</Text>

            </View>

            <View style={styles.sloganContainer}>

                <Text style={styles.slogan}>Descomplicando o atendimento da sua assistência técnica</Text>

            </View>

            <View style={styles.links}>

                <TouchableOpacity style={styles.cadastro} onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.cadastroText}>Crie uma conta</Text>
                    <Ionicons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.login} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Faça Login</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#1C1C1C',
        gap: 50,
    },

    techassist: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: 175,
        height: 175,
    },

    nome: {
        color: 'white',
        fontSize: 40,
    },

    sloganContainer: {
        width: '90%',
        justifyContent: 'center'
    },

    slogan: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
        marginHorizontal: 40,
    },

    links: {
        width: '70%'
    },

    cadastro: {
        height: '40%',
        backgroundColor: '#2A7B4D',
        padding: 10,
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cadastroText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
    },

    login: {

    },

    loginText: {
        textAlign: 'center',
        color: '#2A7B4D',
        fontSize: 16,
    },

});
