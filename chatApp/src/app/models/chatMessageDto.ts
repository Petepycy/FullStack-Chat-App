export class ChatMessageDto {
  id: number;
  name: string;
  message: string;
  image?: string;
  fileName?: string;
  fileType?: string;

  constructor(id: number, name: string, message: string, image?: string, fileName?: string, fileType?: string) {
    this.id = id;
    this.name = name;
    this.message = message;
    this.image = image;
    this.fileName = fileName;
    this.fileType = fileType;
  }
}
