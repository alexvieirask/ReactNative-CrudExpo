import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import PessoaItem from "./PessoaItem";
import db from "./services/sqlite/SqLiteDatabase";

export default function App() {
  // Variaveis para Testar os inserts
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");

  // Variaveis para testar os updates
  const [id, setID] = useState("");
  const [idAtualizar, setIDAtualizar] = useState("");
  const [novoNome, setNovoNome] = useState("");

  // Flatlist
  const [flatlistpessoas, setFlatlistPessoas] = useState([]);

  // Função que é disparada quando inicia o aplicativo
  useEffect(() => {
    createTable();
    AddFlatlist();
  }, []);

  // Função que reseta os inputs
  const resetarInputs = () => {
    setNome("");
    setEmail("");
    setIdade("");
    setNovoNome("");
    setIDAtualizar("");
  };

  // Criação da Tabela pessoas
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS pessoas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, idade INTEGER);"
      );
    });
  };

  // Função que adiciona uma pessoa se o input for diferente de vazio
  const addPessoa = (nome, email, idade) => {
    !nome
      ? console.log("Digite pelo menos o nome")
      : db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO pessoas (nome, email, idade) values (?, ?, ?);",
            [nome, email, idade]
          );
          AddFlatlist();
          resetarInputs();
        });
  };

  //Função que sincroniza a flatlist com os dados do banco de dados
  const AddFlatlist = () => {
    db.transaction((tx) => {
      // O [] Serve para dar a instrução que o resultado sera colodo na lista
      tx.executeSql("SELECT * FROM pessoas", [], (tx, results) => {
        let lista_pessoas = [];
        for (let people = 0; people < results.rows.length; ++people) {
          // Variavel que recebe uma pessoa e suas caracteristicas
          let pessoa = results.rows.item(people);
          lista_pessoas.push({
            id: pessoa.id,
            nome: pessoa.nome,
            email: pessoa.email,
            idade: pessoa.idade,
          });
        }
        setFlatlistPessoas(lista_pessoas);
      });
    });
  };

  //Função que deleta todas as pessoas da tabela pessoas
  const deletePessoas = () => {
    db.transaction((tx) => {
      tx.executeSql("Delete FROM pessoas");
      AddFlatlist();
    });
  };

  // Função que deleta a pessoa por id
  const deletePessoaById = (id) => {
    db.transaction((tx) => {
      tx.executeSql("Delete from pessoas where id = ?", [id], (tx, results) => {
        results.rowsAffected > 0
          ? Alert.alert("Sucesso! ID encontrado.", AddFlatlist(), setID(""))
          : Alert.alert("Insira um id que exista na lista");
      });
    });
  };

  // Função que atualiza o nome da pessoa através do id
  const updatePessoa = () => {
    db.transaction((tx) => {
      tx.executeSql("update pessoas set nome=? where id =?", [
        novoNome,
        idAtualizar,
      ]);
      AddFlatlist();
      resetarInputs();
    });
  };

  //Função que deleta a database
  const dropdatabase = () => {
    db.closeAsync();
    db.deleteAsync();
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <StatusBar style="auto" />

      <View style={styles.container}>
        <Text style={styles.subtitulo}>Pessoas Cadastradas</Text>

        <FlatList //Lista com todas as pessoas
          style={{ height: "50%" }}
          data={flatlistpessoas}
          keyExtractor={(pessoa) => pessoa.id} // Definindo a Key, sendo esta o id da pessoa
          renderItem={({ item: pessoa }) => <PessoaItem pessoa={pessoa} />}
        />

        <ScrollView>
          <View style={{ marginTop: "2%" }}>
            <Text style={styles.titulo}>People Crud - Exposqlite</Text>
            <TextInput
              placeholder="Nome"
              value={nome}
              style={styles.TextInput}
              onChangeText={(nome) => {
                setNome(nome);
              }}
            />

            <TextInput
              placeholder="E-mail"
              value={email}
              style={styles.TextInput}
              onChangeText={(email) => {
                setEmail(email);
              }}
            />

            <TextInput
              placeholder="idade"
              value={idade}
              style={styles.TextInput}
              onChangeText={(idade) => {
                setIdade(idade);
              }}
            />

            <TouchableOpacity
              style={styles.Botao}
              onPress={() => {
                addPessoa(nome, email, idade);
              }}
            >
              <Text>Adicionar Pessoa</Text>
            </TouchableOpacity>

            <Text style={styles.subtitulo}>Funções de Excluir</Text>
            <TextInput
              placeholder="id"
              value={id}
              style={styles.TextInput}
              onChangeText={(id) => {
                setID(id);
              }}
            />

            <TouchableOpacity
              style={styles.Botao}
              onPress={() => deletePessoaById(id)}
            >
              <Text>Excluir pessoa</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 50 }}>
              <TouchableOpacity
                style={styles.Botao}
                onPress={() => deletePessoas()}
              >
                <Text>Excluir dados</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.Botao}
                onPress={() => dropdatabase()}
              >
                <Text>Excluir Database</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitulo}>Funções de Update</Text>

            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="id para atualizar"
                value={idAtualizar}
                style={styles.TextInput}
                onChangeText={(id) => {
                  setIDAtualizar(id);
                }}
              />

              <TextInput
                placeholder="novo nome"
                value={novoNome}
                style={styles.TextInput}
                onChangeText={(nome) => {
                  setNovoNome(nome);
                }}
              />

              <TouchableOpacity
                style={styles.Botao}
                onPress={() => updatePessoa()}
              >
                <Text>Atualizar Pessoa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  titulo: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitulo: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  SafeAreaView: {
    marginTop: "10%",
    flex: 1,
  },
  Botao: {
    backgroundColor: "#f0928b",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: "25%",
    height: 30,
    borderRadius: 5,
  },
  TextInput: {
    backgroundColor: "#d9d8d7",
    marginHorizontal: "25%",
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginVertical: 2,
    textAlign: "center",
  },
});
