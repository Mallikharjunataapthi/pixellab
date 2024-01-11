import { DeleteObjectCommand, PutObjectCommand,S3Client } from '@aws-sdk/client-s3';

export class FileUploadMiddleware {
  private s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_BUCKET_ACCESSKEY,
        secretAccessKey: process.env.S3_BUCKET_SECRETE_ACCESSKEY,
      },
      region:process.env.S3_BUCKET_REGION,
    });
  }

  async s3_upload(ImageFile:any) {

    return 'https://pixellabs3.s3.us-west-2.amazonaws.com/1704194791289_dummy.jpeg';
    const file = ImageFile.buffer;
    const bucket = process.env.AWS_S3_BUCKET;
    const filename = this.RenameFile(ImageFile.originalname);
    const mimetype = ImageFile.mimetype;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: String(filename),
      Body: file,
      ACL: 'public-read', // Set the desired ACL
      ContentType: mimetype,
      ContentDisposition: 'inline',
    });
    try {
      await this.s3.send(command);
      const url = `https://${bucket}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${filename}`
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('S3 file uploading Failed');
    }
  }
  async delteS3File(filePath: any): Promise<void> {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filePath,
      };
  
      const deletedObject = await this.s3.send(new DeleteObjectCommand(deleteParams));
      console.log('Deleted object:', deletedObject);
  
      // Check if the deletion was successful
      if (deletedObject.$metadata.httpStatusCode !== 204) {
        console.error('Object not deleted');
        throw new Error('Object deletion failed.'); // You can customize the error message
      }
    } catch (error) {
      console.error('Error deleting file from S3:', error);
       throw error;
    }
  }
  

  RenameFile(filename:string){
    const newFilename = `${Date.now().toString()}_${filename}`
    return newFilename;
  }
}
