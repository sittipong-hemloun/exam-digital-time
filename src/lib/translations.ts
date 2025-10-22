/**
 * Translation strings for exam clock application
 */

export type Language = "th" | "en";

interface TranslationMap {
  [key: string]: {
    th: string;
    en: string;
  };
}

const translations: TranslationMap = {
  examInfo: { th: "ข้อมูลการสอบ", en: "Exam Information" },
  examInfoDesc: {
    th: "กรอกข้อมูลเกี่ยวกับการสอบ (ข้อมูลที่ไม่กรอกจะไม่แสดง)",
    en: "Enter exam information (empty fields will not be displayed)",
  },
  courseCode: { th: "รหัสวิชา", en: "Course Code" },
  courseName: { th: "ชื่อวิชา", en: "Course Name" },
  lecture: { th: "หมู่บรรยาย", en: "Lecture Section" },
  lab: { th: "หมู่ปฏิบัติ", en: "Lab Section" },
  examTime: { th: "เวลาสอบ", en: "Exam Time" },
  examRoom: { th: "ห้องสอบ", en: "Exam Room" },
  remarks: { th: "หมายเหตุ", en: "Remarks" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  confirm: { th: "ยืนยัน", en: "Confirm" },
  footer: { th: "นาฬิกาดิจิทัลสำหรับห้องสอบ", en: "Digital Clock for Exam Room" },
  decreaseFont: { th: "ลดขนาดตัวอักษร", en: "Decrease Font Size" },
  increaseFont: { th: "เพิ่มขนาดตัวอักษร", en: "Increase Font Size" },
  settings: { th: "ตั้งค่าข้อมูลการสอบ", en: "Information Settings" },
  changeLanguage: { th: "เปลี่ยนภาษา", en: "Change Language" },
  changeTheme: { th: "เปลี่ยนธีม", en: "Change Theme" },
  fullscreen: { th: "เต็มหน้าจอ", en: "Fullscreen" },
  exitFullscreen: { th: "ออกจากเต็มหน้าจอ", en: "Exit Fullscreen" },
  courseCodePlaceholder: {
    th: "เช่น CS101",
    en: "e.g. CS101",
  },
  courseNamePlaceholder: {
    th: "เช่น Computer Programming",
    en: "e.g. Computer Programming",
  },
  lecturePlaceholder: { th: "เช่น 01", en: "e.g. 01" },
  labPlaceholder: { th: "เช่น 001", en: "e.g. 001" },
  timePlaceholder: { th: "เช่น 09:00 - 12:00", en: "e.g. 09:00 - 12:00" },
  roomPlaceholder: { th: "เช่น EN101", en: "e.g. EN101" },
  remarksPlaceholder: { th: "ข้อมูลเพิ่มเติม", en: "Additional information" },
  feedback: { th: "ให้คะแนนเว็บนี้", en: "Rate This Website" },
  examRules: { th: "กฎกติกาการสอบ", en: "Exam Rules" },
  examRuleSubmission: {
    th: "นิสิตสามารถส่งข้อสอบได้เมื่อเวลาผ่านไป 1 ชั่วโมง",
    en: "Students can submit the exam papers after 1 hour of the starting time of the exam.",
  },
  examRuleCommunication: {
    th: "ไม่อนุญาตให้นำเครื่องมือสื่อสารทุกชนิดเข้าห้องสอบ",
    en: "Communication devices of any kind are not allowed into the exam room.",
  },
};

/**
 * Get translated text by key
 */
export const getTranslation = (key: string, language: Language): string => {
  return translations[key]?.[language] || key;
};
