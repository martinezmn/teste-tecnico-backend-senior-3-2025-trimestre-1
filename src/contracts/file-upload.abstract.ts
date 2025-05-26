export abstract class FileUpload {
  abstract uploadFile(
    bucket: string,
    filename: string,
    buffer: Buffer,
  ): Promise<void>;
}
