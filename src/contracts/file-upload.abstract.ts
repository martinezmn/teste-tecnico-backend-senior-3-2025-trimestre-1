export abstract class FileUpload {
  abstract uploadFile(
    bucket: string,
    filename: string,
    buffer: Buffer,
  ): Promise<void>;

  abstract getFile(bucket: string, filename: string): Promise<Buffer>;
}
