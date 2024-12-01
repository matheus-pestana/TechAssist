import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Perfil() {
    const [user, setUser] = useState(null); // Estado para armazenar o usuário logado
    const [photo, setPhoto] = useState(null); // Estado para armazenar a foto do perfil
    const navigation = useNavigation();

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            // Verifica se o displayName está disponível
            setUser({
                name: currentUser.displayName || currentUser.email.split('@')[0], // Fallback para o email, caso o nome não esteja disponível
                email: currentUser.email,
                photoURL: currentUser.photoURL, // Obtém a URL da foto do perfil
                uid: currentUser.uid, // Adiciona o uid do usuário
            });
            setPhoto(currentUser.photoURL); // Carrega a foto do perfil, se disponível
        } else {
            console.log('Nenhum usuário autenticado');
            navigation.replace('Login'); // Redireciona para a tela de login, caso não haja usuário logado
        }
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            'Confirmar Logout',
            'Você tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Logout cancelado'),
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            // Realiza o logout do Firebase
                            await signOut(getAuth());
                            Alert.alert('Logout realizado com sucesso!');
                            navigation.replace('Login'); // Redireciona para a tela de login
                        } catch (error) {
                            console.error('Erro ao fazer logout: ', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleChangephotoURL = async () => {
        if (!user) {
            Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
            navigation.navigate('Login');  // Redireciona para a tela de login
            return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const sourceUri = result.assets[0].uri;

                try {
                    const imageRef = ref(storage, 'photoURLs/' + user.uid);
                    const response = await fetch(sourceUri);
                    const blob = await response.blob();
                    await uploadBytes(imageRef, blob);

                    const downloadURL = await getDownloadURL(imageRef);

                    await updatephotoURLInFirestore(downloadURL);
                } catch (error) {
                    console.error('Erro ao alterar foto de perfil:', error);
                }
            }
        } else {
            Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para alterar a foto de perfil.');
        }
    };

    const updatephotoURLInFirestore = async (downloadURL) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoURL: downloadURL }, { merge: true });
            setUserData((prevData) => ({ ...prevData, photoURL: downloadURL }));
            Alert.alert('Foto de perfil atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar foto de perfil no Firestore:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <View style={styles.container}>
                <View style={styles.infos}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Perfil</Text>
                        <Image
                            style={styles.logo}
                            source={require('../assets/simbolo.png')} // Atualize o caminho conforme necessário
                        />
                    </View>

                    {/* Foto de Perfil */}
                    <View style={styles.profilePictureContainer}>
                        <TouchableOpacity onPress={handleChangephotoURL}>
                            <Image
                                style={styles.profilePicture}
                                source={photo ? { uri: photo } : require('../assets/default-profile.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Informações do Usuário */}
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>
                            {user ? user.name : 'Carregando...'}
                        </Text>

                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>
                            {user ? user.email : 'Carregando...'}
                        </Text>
                    </View>
                </View>

                <View style={styles.logout}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="exit-outline" size={24} color="white" />
                        <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: '#272727',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingTop: 40,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00FF00',
    },
    logo: {
        width: 50,
        height: 50,
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        resizeMode: 'cover',
    },
    userInfo: {
        marginBottom: 40,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#B0B0B0',
        marginTop: 5,
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 15,
        backgroundColor: '#D32F2F',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
