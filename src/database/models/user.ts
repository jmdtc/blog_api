import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
  Association,
  HasManyCreateAssociationMixin
} from "sequelize"
import { Post } from "./post"
import bcrypt from "bcrypt"

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;

    public createPost!: HasManyCreateAssociationMixin<Post>;

    public static associations: {
      posts: Association<User, Post>;
    };
}

export const initUser = async function (sequelize: Sequelize): Promise<void> {
  try {
    await User.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: false,
      sequelize,
    });
    await User.sync({force: true});

  } catch(err) {
    console.error(err)
  }
}
