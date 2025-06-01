export type Report = {
  id: number;
  reported_post_id: string;
  postTitle: string;
  content: string;
  imageUrl: string;
  report_tags?: string[] | string; 
  reason: string;
  reportedBy: string;
  reportedById: string;
  reportedByPhoto?: string;
  author: string;
  reportedUserId: string;
  reportedUserPhoto?: string;
};
