import db from "./SqLiteDatabase";

db.transaction((tx)=>{
    tx.executeSql("CREATE TABLE IF NOT EXISTS pessoas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, idade int);")
})

const insertPeople = (nome,email,idade) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO pessoas (nome, email, idade) values (?, ?, ?);",
          [nome, email, idade],

          console.log(listPeople())
        );
      });
    }

const listPeople = () =>{
  var lista = []
    db.transaction((tx) => {
        tx.executeSql( "SELECT * FROM pessoas",[],(tx,results)=>{
            for (let i=0; i< results.rows.length; ++i)
            lista.push(results.rows.item(i));
            console.log('1',lista)
             
            } 
            );}
             
        );
      
       
    }

    const deleteAllPeoples = () => {
        db.transaction((tx) => {
          tx.executeSql(
            "DELETE FROM pessoas",
          );
        });
      }

    export default {
        insertPeople,
        listPeople,
        deleteAllPeoples

      };

