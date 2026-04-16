export interface Node {
  id:number;
  name: string;
  data?: string;
  children?: Node[];
  isopen?: boolean;
}
