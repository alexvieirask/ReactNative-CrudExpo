import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet,FlatList, Text, View, SafeAreaView, TextInput, TouchableOpacity,Keyboard } from 'react-native';
import db from './services/sqlite/SqLiteDatabase';

export default function App() {
  const [nome,setNome] = useState('')
  const [email,setEmail] = useState('')
  const [idade,setIdade] = useState('')
  const [flatlistpessoas,setFlatlistPessoas] = useState([])

  const createTable = ()=>{
    db.transaction((tx)=>{
      tx.executeSql("CREATE TABLE IF NOT EXISTS pessoas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, idade int);",
      [], )
  })}

  const addPessoa = (nome,email,idade) => {
    if (!nome){
      console.log("Digite pelo menos o nome")
    }
    else{
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO pessoas (nome, email, idade) values (?, ?, ?);",
          [nome, email, idade]
        ); 
        getPessoa()
        setNome("")
        setEmail("")
        setIdade("")
  
      });
    }

  }

  const getPessoa = () =>{
    db.transaction((tx) => {
      tx.executeSql( "SELECT * FROM pessoas",[],(tx,results)=>{
        let lista = []
          for (let i=0; i< results.rows.length; ++i){
            let item = results.rows.item(i);
            lista.push({id:item.id,
                        nome:item.nome,
                        email:item.email,
                        idade:item.idade})} 
                      setFlatlistPessoas(lista)})
                    }
                    );
  }

  const deletePessoas = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DROP FROM pessoas",
      );
      getPessoa()
    });
  }
  
  const renderPessoa = ({ item }) => {
    return (
      <View style={{
       flexDirection:'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}>
        <Text style={{ marginRight: 9 }}>{item.id}</Text>
        <Text style={{ marginRight: 9 }}>{item.nome}</Text>
        <Text style={{ marginRight: 9 }}>{item.email}</Text>
        <Text style={{ marginRight: 9 }}>{item.idade}</Text>
      </View>
    );
  };

  useEffect( ()=>{
     createTable();
     getPessoa();
  },[])


  


  return (

    <SafeAreaView style={styles.SafeAreaView}>
    <StatusBar style="auto" />
    
    <View style={styles.container}>
        <Text style={styles.titulo}>People Crud - Exposqlite</Text>
        <TextInput placeholder='Nome' value={nome} style={styles.TextInput} onChangeText={(nome) => {setNome(nome)}} />
        <TextInput placeholder='E-mail'value={email} style={styles.TextInput} onChangeText={(email) => {setEmail(email)}} />
        <TextInput placeholder='idade' value={idade} style={styles.TextInput} onChangeText={(idade) => {setIdade(idade)}} />
        
        <TouchableOpacity style={styles.Botao} onPress={()=>{addPessoa(nome,email,idade)}}>
        <Text>Adicionar Pessoa</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Pessoas Cadastradas</Text>
        
        <FlatList
        data={flatlistpessoas}
        
        keyExtractor={item => item.id}
        renderItem={renderPessoa}
        />
        
        <TouchableOpacity style={styles.Botao} onPress={()=>deletePessoas()}>
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

