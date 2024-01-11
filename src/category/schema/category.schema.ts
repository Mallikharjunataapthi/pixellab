import { InjectModel, Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import { Model, model } from "mongoose"
import { Template } from "src/templates/Schema/template.schema";

@Schema({
    timestamps: true,
  })

  export class Category{
    constructor(
      @InjectModel(Template.name) private TemplateModel: Model<Template>
    ){}
    @Prop({ 
      required: [true, 'Category name is required'],
     unique: [true, 'Category name is Must be Unique'] })
    cat_name:String;
    @Prop({ required: true, enum: ['1', '0'], default: '1' })
    is_active:String;
  } 

  export type CategoryDocument = Category & Document;
  export const CategorySchema = SchemaFactory.createForClass(Category);

//   CategorySchema.post('findOneAndUpdate', async function (result, next) {
//     // Access the updated category name from the 'result' object
//     const updatedCategoryName = result.cat_name; 

//     // Note: If you're using Mongoose version 6 or later, you might want to use 'updateMany' instead of 'update'
//     await Category[0].TemplateModel.updateMany({ cat_id: result._id }, { $set: { category_name: updatedCategoryName } });

//     next();
// });