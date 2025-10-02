import * as SQlite from "expo-sqlite";


async function CriaBanco() {
    //criar banco de dados
    try {
        const db = await SQlite.openDatabaseAsync('fatecVotorantim.db');
        console.log("Banco de dados criado com sucesso!");
        return db;
    } catch (error) {
        console.error("Erro ao criar banco de dados:", error);
    }
}

//criar tabela           
async function criaTabela(database: SQlite.SQLiteDatabase) {
    try {  //execAsync para executar multiplas linhas
           //runAsync para executar uma linha
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USUARIO (
                ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME_US VARCHAR(100),
                EMAIL_US VARCHAR(100)
            )
            `);
        console.log("Tabela criada com sucesso!");
    } catch (error) {
        console.error("Erro ao criar tabela:", error);
    }
}

//inserir dados
async function insereDados(db:SQlite.SQLiteDatabase, nome:string, email:string) {
    try {
        await db.runAsync(`
            INSERT INTO USUARIO (NOME_US, EMAIL_US) VALUES (?, ?)
        `, [nome, email]);
        console.log("Dados inseridos com sucesso!");
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
}

//dropar tabela
async function dropTabela(db:SQlite.SQLiteDatabase) {
    try {
        await db.execAsync(`
            DROP TABLE IF EXISTS USUARIO
        `);
        console.log("Tabela dropada com sucesso!");
    } catch (error) {
        console.error("Erro ao dropar tabela:", error);
    }
}

//selceionar todos os dados
async function selectTodos(db:SQlite.SQLiteDatabase) {
    try {
        let arrayReg = await db.getAllAsync(`
            SELECT * FROM USUARIO
        `);
        console.log("Dados selecionados com sucesso!", arrayReg);
        return arrayReg;
    } catch (error) {
        console.error("Erro ao selecionar dados:", error);
    }
}

//exportar a função (não utiliza default pois pode ter mais funções)
export { CriaBanco, criaTabela, insereDados, dropTabela, selectTodos };
