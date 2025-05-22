export type Report = {
  id: string | number;
  postTitle: string;
  author:string;
  reportedBy: string;
  reason: string;
  content: string;
  imageUrl?: string;
};