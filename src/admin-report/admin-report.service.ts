import { HttpStatus, Injectable } from '@nestjs/common';
import { Template } from 'src/templates/Schema/template.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TemplateUsersReport } from 'src/user-templates/schema/usertemplatescount.schema';

@Injectable()
export class AdminReportService {
  constructor(
    @InjectModel(Template.name) private TemplateModel: Model<Template>,
    @InjectModel(TemplateUsersReport.name)
    private UserTemplateReportModel: Model<TemplateUsersReport>,
  ) {}

  async MostUsedTemplates(page: number = 0, pageSize: number = 10) {
    try {
      const skip = (page - 1) * pageSize;
      const result = await this.TemplateModel.find()
        .sort({ used_count: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate('app_id', 'app_name');
      const totalCategories = await this.TemplateModel.countDocuments();
      if (result) {
        return {
          success: true,
          StatusCode: HttpStatus.OK,
          data: {
            result,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / pageSize),
            pageSize,
          },
        };
      } else {
        return {
          success: true,
          StatusCode: HttpStatus.NOT_FOUND,
          data: {
            result,
            currentPage: page,
            totalPages: Math.ceil(totalCategories / pageSize),
            pageSize,
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        StatusCode: HttpStatus.BAD_REQUEST,
        message: 'Category Fetching failed',
      };
    }
  }

  async MostActiveUsers(
    page: number,
    pageSize: number,
    fromDatestring: string,
    toDatestring: string,
  ) {
    try {
      const skip = (page - 1) * pageSize;

      const fromDate = new Date(fromDatestring); // Replace with your actual from date
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(toDatestring);
      toDate.setHours(23, 59, 59, 999);
      const filter = {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      };
      let totaltemplates = 0;
      if (fromDatestring && toDatestring) {
        totaltemplates =
          await this.UserTemplateReportModel.countDocuments(filter);
      } else {
        totaltemplates = await this.UserTemplateReportModel.countDocuments();
      }

      const pipeline = [];

      if (fromDatestring && toDatestring) {
        pipeline.push({
          $match: {
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
          },
        });
      }

      pipeline.push(
        {
          $group: {
            _id: '$user_id',
            userCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { userIdString: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', { $toObjectId: '$$userIdString' }],
                  },
                },
              },
            ],
            as: 'userDetails',
          },
        },
        {
          $project: {
            _id: 0,
            user_id: '$_id',
            userCount: 1,
            userName: '$userDetails.username',
            appName: '$userDetails.app_name',
          },
        },
      );
      // console.log(pipeline);
      const data = await this.UserTemplateReportModel.aggregate(pipeline);

      return {
        success: true,
        StatusCode: HttpStatus.OK,
        data: {
          result: data,
          currentPage: page,
          totalPages: Math.ceil(totaltemplates / pageSize),
          pageSize,
        },
      };
    } catch (error) {}
  }
}
