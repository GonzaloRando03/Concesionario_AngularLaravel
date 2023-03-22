export interface Usuario {
    id?: number
    nombre: string
    email: string
    password: string
    gps?: null | string
}

export interface Login {
    email: string
    password: string
}

export interface Marca {
    id?: number
    nombre: string
    created_at?:string
    coches_totales?: number
    pais: string
    image?: any
}