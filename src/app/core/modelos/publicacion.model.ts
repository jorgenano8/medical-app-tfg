import { Comentario } from "./comentario.model";

export class Publicacion {

  constructor(
    public uid?: string,
    public usuario?: string,
    public nombre?: string,
    public apellidos?: string,
    public especialidad?: string,
    public dateSystem?: Date,
    public fechaPublicacion?: string,
    public etiqueta?: string,
    public titulo?: string,
    public contenido?: string,
    public comentarios?: Comentario[],
  ) {}

}
