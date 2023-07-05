import {Mensaje} from "./mensaje.model";

export class Chat {

  constructor(
    public uid?: string,
    public usuario1?: string,
    public usuario2?: string,
    public usuarios?: string,
    public mensajes?: Mensaje[],
  ) {}

}
