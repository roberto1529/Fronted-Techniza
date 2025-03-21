export interface FormatoDto {
    id?: number;
    id_cliente: number;
    cliente: string;
    correo: string;
    direccion: string;
    telefono: string;
    id_estado: number;
    atencion: string;
    subtotal: string;
    iva: string;
    total: string;
    estado_nombre: string;
    estado: boolean;
    cantidad: string;
    fecha_reg: string;
}

export interface DetalleFact{
    id?: number;
    modelo: string;
    descripcion: string;
    marca: string;
    precio?: any;
    cantidad?: number
}

export interface ClientesFact{
    id: string;
    nombre: string;
}

export interface EstadoFact{
    id: number;
    estado: string;
}