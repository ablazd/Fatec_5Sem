import React,{useState} from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth : 1,
        borderColor: '#000',
        width: 200,
        height: 40,
        marginBottom: 20,
        padding: 10,
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
        color: '##ff8da1',
        fontWeight: 'bold',
        textAlign: 'center',
        
    }
});

const Alert = ()=> {
    console.log("Botão pressionado");}

//head
const Campos = () => {
    let label = "Nome: ";
    //sem importar o useState la em cima dá para usar chamando o react e depois o atributo:
    //const [campo, setCampo] = React.useState("");
    const [campo, setCampo] = useState("");

//body
return(
    <View>
        <Text style = {estilo.label}> {label} </Text>
        <TextInput style = {estilo.input} onChangeText={(text)=>{setCampo(text)}}/>
            <Button
            title = "Ver" onPress={()=>{Alert()}}/>
        <Text> Digitado: { campo } </Text>
    </View>
);
}

export default Campos;