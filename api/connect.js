import { } from 'dotenv/config'
import mysql, { createPool } from 'mysql';

console.log(process.env.MYSQL_HOST)

export const db = createPool({
    host: `${process.env.MYSQL_HOST}`,
    user: `${process.env.MYSQL_USER}`,
    password: `${process.env.MYSQL_PASSWORD}`,
    database: `${process.env.MYSQL_DB}`,
})