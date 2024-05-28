
export class CreateMessageDto {
    content: string;
    type: string = "message"; // message, png, pegj, pdf
    send_by : string;
    send_to: string;
    datetime: string;
    filename: string = null;
}
