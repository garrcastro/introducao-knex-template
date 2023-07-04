import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Get All Bands
app.get("/bands", async (req: Request, res: Response)=>{
    try {
        const result = await db.raw(`
        SELECT * FROM bands;
        `)
        res.status(200).send(result)
    } catch (error:any) {
        console.log(error)
        res.send(error.message)
    }
})

// Add New Band
app.post("/bands", async(req:Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name

        if(typeof id !='string'){
            res.status(400)
            throw new Error ("Id inválido! Deve ser uma string.")
        }
        if(typeof name !='string'){
            res.status(400)
            throw new Error ("Name inválido! Deve ser uma string.")
        }
        if(id.length<1 || name.length < 1){
            res.status(400)
            throw new Error ("Id/Name deve ter mais que um caractere.")
        }
        const result = await db.raw(`
            INSERT INTO bands (id, name)
            VALUES ("${id}", "${name}")
        `)

        res.status(200).send("Banda cadastrada com sucesso!")
    } catch (error:any) {
        console.log(error)
        res.send(error.message)
    }
})

//Edit band
app.put("/bands/:id", async(req:Request, res:Response) =>{
    try {
        const id = req.params.id
        const newId = req.body.id
        const newName = req.body.name
        const [band] = await db.raw(`
            SELECT * FROM bands
            WHERE id = "${id}"
        `)
        if(newId !== undefined){
            if(typeof newId !=='string'){
                res.status(400)
                throw new Error ("Id inválido. Deve ser texto.")
            }
            if(newId.length<1){
                res.status(400)
                throw new Error ("Id inválido. Deve conter mais que um caractere.")
            }
        }
        if (newName !== undefined){
            if(typeof newName !=="string"){
                res.status(400)
                throw new Error ("Nome inválido. Deve ser texto.")
            }
            if(newName.length<1){
                res.status(400)
                throw new Error ("Nome inválido. Deve possuir mais que um caractere.")
            }
        }

        if (band){
            await db.raw(`
                UPDATE bands
                SET
                    id = "${newId || band.id}",
                    name = "${newName || band.name}"
                WHERE
                    id = "${id}";
            `)
        }else{
            res.status(404).send("Id não encontrado.")
        }
        res.status(200).send("Banda atualizada com sucesso.")
    } catch (error:any) {
        console.log(error)
        res.send(error.message)
    }
})

// Get All Songs
app.get("/songs", async (req: Request, res: Response)=>{
    try {
        const result = await db.raw(`
        SELECT * FROM songs;
        `)
        res.status(200).send(result)
    } catch (error:any) {
        console.log(error)
        res.send(error.message)
    }
})

// Add New Song
app.post("/songs", async(req:Request, res: Response) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const band_id = req.body.band_id

        if(typeof id !='string'){
            res.status(400)
            throw new Error ("Id inválido! Deve ser uma string.")
        }
        if(typeof name !='string'){
            res.status(400)
            throw new Error ("Name inválido! Deve ser uma string.")
        }
        if(id.length<1 || name.length < 1){
            res.status(400)
            throw new Error ("Id/Name deve ter mais que um caractere.")
        }
        const result = await db.raw(`
            INSERT INTO songs (id, name, band_id)
            VALUES ("${id}", "${name}", "${band_id}")
        `)

        res.status(200).send("Música cadastrada com sucesso!")
    } catch (error:any) {
        console.log(error)
        res.send(error.message)
    }
})

//Edit song
app.put("/songs/:id", async(req:Request, res:Response) =>{
    try {
        const id = req.params.id
        const newId = req.body.id
        const newName = req.body.name
        const newBand_id = req.body.band_id
        const [song] = await db.raw(`
            SELECT * FROM songs
            WHERE id = "${id}"
        `)
        if(newId !== undefined){
            if(typeof newId !=='string'){
                res.status(400)
                throw new Error ("Id inválido. Deve ser texto.")
            }
            if(newId.length<1){
                res.status(400)
                throw new Error ("Id inválido. Deve conter mais que um caractere.")
            }
        }
        if (newName !== undefined){
            if(typeof newName !=="string"){
                res.status(400)
                throw new Error ("Nome inválido. Deve ser texto.")
            }
            if(newName.length<1){
                res.status(400)
                throw new Error ("Nome inválido. Deve possuir mais que um caractere.")
            }
        }

        if (song){
            await db.raw(`
                UPDATE songs
                SET
                    id = "${newId || song.id}",
                    name = "${newName || song.name}"
                    band_id = "${newBand_id || song.band_id}"
                WHERE
                    id = "${id}";
            `)
        }else{
            res.status(404).send("Id não encontrado.")
        }
        res.status(200).send("Música atualizada com sucesso.")
    } catch (error:any) {
        console.log(error)
        res.send(error.message)
    }
})