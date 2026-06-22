export interface RequestData {
  id: string;
  senderId: string;
  receiverId: string;
}
export interface GetAllRequestsResponseDTO {
  requests: RequestData[];
}
