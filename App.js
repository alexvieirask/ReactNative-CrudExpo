import { StatusBar } from 'expo-status-bar';
import React,{useState, useEffect} from 'react';
import { StyleSheet,FlatList, Text, View, SafeAreaView,Alert, TextInput, TouchableOpacity,ScrollView } from 'react-native';
import db from './services/sqlite/SqLiteDatabase';

export default function App() {
  // criação dos inputs
  const [nome,setNome] = useState('')
  const [email,setEmail] = useState('')
  const [idade,setIdade] = useState('')
  const [id,setID] = useState('')
  const [idAtualizar,setIDAtualizar] = useState('')
  const [novoNome,setNovoNome] = useState('')
  
  // Flatlist
  const [flatlistpessoas,setFlatlistPessoas] = useState([])

  const createTable = ()=>{ // Criação da Tabela pessoas
    db.transaction((tx)=>{
      tx.executeSql("CREATE TABLE IF NOT EXISTS pessoas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, idade int);",
      [], )
  })}
  const addPessoa = (nome,email,idade) => { //Função que adiciona uma pessoa
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
  const getPessoa = () =>{ //Função que atualiza a Flatlist e lista todas as pessoas
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
  const deletePessoas = () => { //Função que deleta todas as pessoas da tabela pessoas
    db.transaction((tx) => {
      tx.executeSql(
        "Delete FROM pessoas",
      );
      getPessoa()
    });
  }
  const deletePessoaById = (id) =>{ // Deletar pessoa por id
    db.transaction((tx)=>{
      tx.executeSql("Delete from pessoas where id = ?",
      [id],
      (tx,results) =>{
        if(results.rowsAffected>0){
          Alert.alert("Sucesso! ID encontrado.",
          getPessoa(),
          setID('')
          )
        }else{
          alert("Insira um id que exista na lista") }} 
          )
        }
      );
  }
  const renderPessoa = ({ item }) => { // Apenas o componente para aparecer na flatlist
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
        <Text style={{ marginRight: 9 }}> {item.email}</Text>
        <Text style={{ marginRight: 9 }}> {item.idade}</Text>
      </View>
    );
  }
  const dropdatabase = () =>{ //Função que deleta a database - Para testes
    db.closeAsync()
    db.deleteAsync()
  }
  const updatePessoa = () =>{ // Função que atualiza o nome de uma pessoa através do id
    db.transaction((tx) => {
      tx.executeSql(
        "update pessoas set nome=? where id =?",
        [novoNome,idAtualizar]
      );
      getPessoa()
      setNovoNome("")
      setIDAtualizar("")
    });

  }
      
  useEffect( ()=>{ // Função que  é disparada na página inicialmente
     createTable();
     getPessoa();
  },[]
  )


  return (
  
  <SafeAreaView style={styles.SafeAreaView}>
    <StatusBar style="auto" />
    
    <View style={styles.container}>
        <Text style={styles.titulo}>People Crud - Exposqlite</Text>
        
        <TextInput placeholder='Nome' 
        value={nome} style={styles.TextInput} 
        onChangeText={(nome) => {setNome(nome)}} />
        
        <TextInput placeholder='E-mail'
        value={email} style={styles.TextInput} 
        onChangeText={(email) => {setEmail(email)}} />
        
        <TextInput placeholder='idade' 
        value={idade} style={styles.TextInput} 
        onChangeText={(idade) => {setIdade(idade)}} />
        
        <TouchableOpacity style={styles.Botao} onPress={()=>{addPessoa(nome,email,idade)}}>
        <Text>Adicionar Pessoa</Text>
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Pessoas Cadastradas</Text>
        
        <FlatList //Lista com todas as pessoas
        style={{height:50}}
        data={flatlistpessoas}
        keyExtractor={item => item.id} // Definindo a Key, sendo esta o id da pessoa
        renderItem={renderPessoa} 
        />
    
    <ScrollView>
      <Text style={styles.subtitulo}>Funções de Excluir</Text>
          <TextInput placeholder='id' 
          value={id} style={styles.TextInput} 
          onChangeText={(id) => {setID(id)}} />
          
          <TouchableOpacity style={styles.Botao} onPress={()=>deletePessoaById(id)}>
          <Text>Excluir pessoa</Text>
          </TouchableOpacity>
          
          <View style={{marginTop:50}}>
            <TouchableOpacity style={styles.Botao} onPress={()=>deletePessoas()}>
            <Text>Excluir dados</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.Botao} onPress={()=>dropdatabase()}>
            <Text>Excluir Database</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitulo}>Funções de Update</Text>

          <View style={{marginTop:10}}>
            <TextInput placeholder='id para atualizar' 
            value={idAtualizar} style={styles.TextInput} 
            onChangeText={(id) => {setIDAtualizar(id)}} />

            <TextInput placeholder='novo nome' 
            value={novoNome} style={styles.TextInput} 
            onChangeText={(nome) => {setNovoNome(nome)}} />

            <TouchableOpacity style={styles.Botao} onPress={()=>updatePessoa()}>
            <Text>Atualizar Pessoa</Text>
            </TouchableOpacity>
          </View>


    </ScrollView>
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
    marginVertical:5,
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
    marginVertical:2,
    textAlign:'center'
  }
});

