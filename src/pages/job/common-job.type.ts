export enum Language {
  ENGLISH = 'English',
  Amaharic = 'Amharic',
  Oromo = 'Afan-Oromo',
  Arabic = 'Arabic',
  Frensh = "French",
  Swahili = 'Swahili'
}

  export enum Education {
    NoFormalEducation = "No formal education",
    PrimarySchool = "Primary school",
    SecondarySchool = "Secondary school",
    TVET = "TVET",
    BachelorsDegree = "Bachelors degree",
    MastersDegree = "Masters degree",
    DoctorateOrHigher = "Doctrate of higher",
  }
  
  export interface JobLevel {
    id: number;
    name: string;
  }
  
  export interface Competency {
    id?:string,
    jobLevel: JobLevel;
    education: JobLevel; 
    fieldOfStudies: string[];
    skill: string[];
    attitude: string[];
  }
  export interface CommonObjectType {
    id:string;
    name:string;
  }
  
  export interface CommonJob {
    party_id: string;
    jobCategoryId: string;
    jobCategory: {id:number, name:string};
    jobId:string;
    jobName: string;
    jobDescription: string;
    jobResponsibility:string
    language: Language.ENGLISH;
    addedByAdmin: boolean;
    competency: Competency[];
    jobEnvironment: CommonObjectType[];
  }

  export interface UserData {
    _id: string;
    account_id: string;
    date: Date;
    party_id: string;
    phonenumber: string;
    profile_name: string;
    role: string;
    status: string;
}

interface LangProp{
  code:string,
  name:string
}
export const langauges:LangProp[] = [
  {code:"en", name:"english"},
  {code:"am", name:"አማርኛ"},
  {code:"tgr", name:"ትግርኛ"},
  {code:"or", name:"afan-oromo"},
  {code:"sm", name:"somali"},
  {code:"ar", name:"العربية"},
  {code:"fr", name:"français"},
  {code:"sw", name:"swahili"},
]