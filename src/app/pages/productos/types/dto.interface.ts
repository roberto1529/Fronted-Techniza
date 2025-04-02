export interface DatosTableDto {
	id?: number;
	id_marca: number;
	marca: string;
	modelo: string;
	descripcion: string;
	costo: number;
	ganancia: number;
	utilidad: number;
	venta: number;
	estado: boolean;
	fecha_reg: string; 
}

export interface MarcasproductoDto {
	id: number;
	marca: string;
}



export interface MarcasproductoListDto {
	id: number;
	marca: string;
	estado: boolean;
}