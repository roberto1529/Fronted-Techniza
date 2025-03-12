export interface empleadosDto {
    id?: any;
    nombre: string;
    apellido1: string;
    apellido2: string;
    clave: string;
    claveCrypto?: string;
    fecha_reg: any;
    correo: string;
    usuario: string;
    estado: boolean;
    rol?: any;
}

export interface usuarioDto{
    id: number;
    usuario: string;
}