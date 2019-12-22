import { Role } from './role.model';

export class User {

   constructor(
      public name: string,
      public last_name: string,
      public middle_name: string,
      public document: string,
      public email: string,
      public phone: string,
      public username: string,
      public password?: string,
      public roles?: Array<any>,
      public id_user?: number,
      public active?: boolean,
      public profile_image?: string,
      public created_at?: Date,
      public updated_at?: Date,
   ) { }

}
