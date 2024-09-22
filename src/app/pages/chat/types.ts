export interface GetMessagesForTeacherOrStudentInGroupResponse {
  id?: number;
  groupId?: number;
  senderStudentId?: number;
  senderStudent?: SenderStudent;
  senderStaffId?: number;
  senderStaff?: SenderStaff;
  recipientStudentId?: null | number;
  content?: string;
  sentAt?: string ;
  isSendToGroup?: boolean;
  align?: string;
}

export interface SenderStudent {
  id?: number;
  groupId?: number;
  firstName?: string;
  lastName?: string;
  profileImage?: null;
  lastUpdateDate?: string;
}

interface SenderStaff {
  id?: number;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface GetMessagesForTeacherInGroup
  extends GetMessagesForTeacherOrStudentInGroupResponse {}

export interface SendMessageToGroupPayload {
  groupId: number;
  teacherId: number;
  content: string;
}

export interface SendMessageToStudentPayload extends SendMessageToGroupPayload {
  studentId: number;
}

export interface StudentSendMessageToGroupPayload {
  groupId: number;
  studentId: number;
  content: string;
}

export interface GetStudentsHaveMessagesResponse extends SenderStudent {}
