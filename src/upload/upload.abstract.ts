export abstract class UploaderAbstract {
  abstract upload(file: Express.Multer.File);
}
