import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet,FlatList, Text, View, SafeAreaView, TextInput, TouchableOpacity,Keyboard } from 'react-native';
import Pessoa from './services/sqlite/Pessoa';


export default function App() {
  const [nome,setNome] = useState('')
  const [email,setEmail] = useState('')
  const [idade,setIdade] = useState('')



  const [flatlistpessoas,setFlatlistPessoas] = useState([])

  useEffect(()=>{
    const dados = Pessoa.listPeople()
    setFlatlistPessoas(dados)
    console.log('2',dados)
  },[])

  const adicionarpessoa = (nome,email,idade) =>{
    Pessoa.insertPeople(nome,email,idade)
    setNome("")
    setEmail("")
    setIdade("")
    Keyboard.dismiss()
  }

  const deletartudo = ()=>{
    Pessoa.deleteAllPeoples()
  }


  return (

    <SafeAreaView style={styles.SafeAreaView}>
    <StatusBar style="auto" />
    
    <View style={styles.container}>
        <Text style={styles.titulo}>People Crud - Exposqlite</Text>
        <TextInput placeholder='Nome' value={nome} style={styles.TextInput} onChangeText={(nome) => {setNome(nome)}} />
        <TextInput placeholder='E-mail'value={email} style={styles.TextInput} onChangeText={(email) => {setEmail(email)}} />
        <TextInput placeholder='idade' value={idade} style={styles.TextInput} onChangeText={(idade) => {setIdade(idade)}} />
        
        <TouchableOpacity style={styles.Botao} onPress={()=>{adicionarpessoa(nome,email,idade)}}>
        <Text>Adicionar Pessoa</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Pessoas Cadastradas</Text>
        
        <FlatList
        data={flatlistpessoas}
        
        keyExtractor={(index) => index.toString()}
        renderItem={({item}) => 
        <View style={{height:'100%',width:'100%',backgroundColor:'blue'}}>
         <Text>{item}</Text> 
          
          </View>}/>
        
        <TouchableOpacity style={styles.Botao} onPress={()=>deletartudo()}>
        <Text>Excluir dados</Text>
        </TouchableOpacity>
     
     

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  titulo:{
    textAlign:'center',
    fontSize:22,
    fontWeight:'bold'
  },
  subtitulo:{
    textAlign:'center',
    fontSize:18,
    fontWeight:'bold',
    marginTop:10,
  },
  SafeAreaView:{
    marginTop:'10%',
    flex:1
  },
  Botao:{
    backgroundColor:'#f0928b',
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    marginBottom:10,
    marginHorizontal:'25%',
    height:30,
    borderRadius:5
  },
  TextInput:{
    backgroundColor:'#d9d8d7',
    marginHorizontal:'25%',
    height:35, 
    borderRadius:10,
    alignItems:'center',
    padding:10,
    marginVertical:2
  }
});

