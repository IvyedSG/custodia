export interface CustodiaItem {
  id: number; 
  nombres: string;
  numeracion: string; 
  ubicacion: string; 
  equipo: string; 
  telefono: string;
  entregado: boolean; 
  fechaIngreso?: string; 
  horaIngreso?: string; 
  itemDescription?: string;
  itemCategory?: string;
  notes?: string;
  userId?: number; 
  teamId?: number; 
}

export interface LocationWithItems {
  location: number;
  items: CustodiaItem[];
  isEmpty: boolean;
}