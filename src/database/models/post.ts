import {
  Sequelize,
  Model,
  DataTypes,
  Optional
} from "sequelize"

interface PostAttributes {
  id: string;
  title: string;
  body: string;
  author_id: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

export class Post extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
    public id!: string;
    public title!: string;
    public body!: string;
    public author_id!: string;

    public readonly created_at!: Date;
}

export const initPost = async function (sequelize: Sequelize): Promise<void> {
  try {
    await Post.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      body: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      author_id: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      tableName: "posts",
      underscored: true,
      createdAt: "created_at",
      timestamps: true,
      updatedAt: false,
      sequelize,
    });

    await Post.sync({force: true}) // resets and rewrites the db tables
                                   // using for the sake of the easy installation, not for production

  } catch(err) {
    console.error(err)
  }
}
