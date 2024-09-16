export interface GetMessagesForTeacherOrStudentInGroupResponse {
  id?: number;
  groupId?: number;
  senderStudentId?: number;
  senderStudent?: SenderStudent;
  senderStaffId?: number;
  senderStaff?: SenderStaff;
  recipientStudentId?: null | number;
  content?: string;
  sentAt?: string | Date;
  isSendToGroup?: boolean;
  align?:string

}

interface SenderStudent {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: null;
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

export interface StudentSendMessageToGroupPayload {
  groupId: number;
  studentId: number;
  content: string;
}

