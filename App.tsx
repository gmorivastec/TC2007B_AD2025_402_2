import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// imports para autenticación de usuarios
import { 
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  UserCredential,
  sendPasswordResetEmail, 
  getAuth
} from 'firebase/auth';

// imports para firestore (database)
import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  QuerySnapshot 
} from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// inicializa autenticación
const auth = getAuth(app);

// inicializa base de datos
const db = getFirestore(app);

export default function App() {

  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[nombre, setNombre] = useState("");
  const[raza, setRaza] = useState("");
  
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='email'
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput 
        placeholder='password'
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
        }}
      />
      <Button 
        title='Registrar usuario'
        onPress={() => {

          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential : UserCredential) => {
            console.log("USUARIO REGISTRADO: " + userCredential.user.email);
          })
          .catch(error => {
            console.log("ERROR " + error.message + " " + error.code);

            if(error.code == "auth/missing-password")
              alert("PONLE PASSWORD");
          });
        }}
      />
      <Button 
        title='login'
        onPress={() => {
          signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            console.log("LOGGINEADO: " + userCredential.user.email);
          }).catch(error => {
            console.log("error: " + error);
          });
        }}
      />
      <Button 
        title='logout'
        onPress={() => {
          auth.signOut();
        }}
      />
      <Button 
        title='mail de reset'
        onPress={() => {}}
      />
      <Button 
        title='agregar perrito'
        onPress={async() => {
          
          try {
            var perritosCollection = collection(db, "perritos");
            const newPerrito = await addDoc(
              perritosCollection,
              {nombre: "firualis", raza: "callejero"}
            );

            console.log("ID DEL NUEVO PERRITO: " + newPerrito.id);
          } catch(e) {
            // fail gracefully
            console.log("excepcion: " + e);
          } finally {
            console.log("ESTO SIEMPRE CORRE");
          }
        }}
      />
      <Button 
        title='listar perritos'
        onPress={async() => {

          const perritos = collection(db, "perritos");
          var snapshot = await getDocs(perritos);
          snapshot.forEach(currentDoc => {
            console.log(currentDoc.data());
          });
        }}
      />
      <Button 
        title='query con perritos'
        onPress={async() => {
          const perritos = collection(db, "perritos");
          const q = query(perritos, where("raza", "==", "callejero"));
          const snapshot = await getDocs(q);
          snapshot.forEach(currentDoc => {
            console.log(currentDoc.data());
          });
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
