export interface Producto {
    id_producto: number; // Asegúrate de que el tipo sea consistente
    nombre_producto: string;
    precio_producto?: number; // Opcional, si no siempre está presente
    cantidad?: number; // Opcional, si no siempre está presente
  }

export  interface List {
    id_lista: number;
    nombre_lista: string;
    productos: Producto[];
  }
