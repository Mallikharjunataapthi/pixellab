import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as MongooseSchema, Types } from 'mongoose';
import { Template } from 'src/templates/Schema/template.schema';

@Schema({
  timestamps: true,
})
export class Category {
  constructor(
    @InjectModel(Template.name) private TemplateModel: Model<Template>,
  ) {}
  @Prop({
    // required:[true, 'Category required'],
    type: Types.ObjectId,
    ref: 'Apps',
  })
  app_id: Types.ObjectId;
  @Prop({
    required: [true, 'Category name is required'],
    unique: false,
  })
  cat_name: string;
  @Prop({ required: true, enum: ['1', '0'], default: '1' })
  is_active: string;
  @Prop({ type: String })
  image_url?: string;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre('save', async function (next) {
  const CategoryModel = this.constructor as Model<CategoryDocument>;

  const existingCategory = await CategoryModel.findOne({
    app_id: this.app_id,
    cat_name: this.cat_name,
  });

  if (existingCategory) {
    const error = new Error(
      'Category with the  app name and category name already exists',
    );
    next(error);
  } else {
    next();
  }
});

CategorySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const update = this.getUpdate() as { app_id?: any; cat_name?: any };

  const cat_name = update?.cat_name;
  const app_id = update?.app_id;

  const CategoryModel = this.model as Model<CategoryDocument>;
  const existingCategory = await CategoryModel.findOne({
    app_id: app_id,
    cat_name: cat_name,
    _id: { $ne: query._id },
  });

  if (existingCategory) {
    const error = new Error('Category already exists');
    next(error);
  } else {
    next();
  }
});

//   CategorySchema.post('findOneAndUpdate', async function (result, next) {
//     // Access the updated category name from the 'result' object
//     const updatedCategoryName = result.cat_name;

//     // Note: If you're using Mongoose version 6 or later, you might want to use 'updateMany' instead of 'update'
//     await Category[0].TemplateModel.updateMany({ cat_id: result._id }, { $set: { category_name: updatedCategoryName } });

//     next();
// });
