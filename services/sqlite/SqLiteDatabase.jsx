import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("clientes.db")

export default db