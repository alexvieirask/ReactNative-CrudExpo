import { Text, View } from "react-native";


// Apenas o componente para aparecer na flatlist
export default function pessoaItem({ pessoa }) {
  return (
    <View
      style={{
        marginHorizontal:'2%',  
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#d1cdc7",
        marginBottom:10,
        borderRadius:10,
        alignItems:'center'
      }}
    >
      <Text style={{ marginRight: 9, fontWeight:'bold' }}>{"Id:" + pessoa.id}</Text>
      <Text style={{ marginRight: 9 }}>{"Nome:" + pessoa.nome}</Text>
      <Text style={{ marginRight: 9 }}>{"Email:" + pessoa.email}</Text>
      <Text style={{ marginRight: 9 }}>{"Idade:" + pessoa.idade}</Text>
    </View>
  );
}
