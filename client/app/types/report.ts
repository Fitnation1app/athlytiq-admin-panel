export type Report = {
  id: number;
  postTitle: string;
  content: string;
  imageUrl: string;
  reason: string;
  reportedBy: string;
  reportedById: string;
  reportedByPhoto?: string;
  author: string;
  reportedUserId: string;
  reportedUserPhoto?: string;
};
