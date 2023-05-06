export class Publicacion {

  constructor(
    public uid?: string,
    public usuario?: string,
    public fechaPublicacion?: Date,
    public etiqueta?: string,
    public titulo?: string,
    public contenido?: string,
  ) {}

}
