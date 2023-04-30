export interface StoryInt {
  id: number;
  header: string;
  richText: string;
  user: {
    id: number;
    name: string;
  };

  likes: number[];

  locations: {
    id:number;
    lat: number;
    lng: number;
    name: string;
  }[];

  comments?:{
    text:string;
    user: {
      id: number;
      name: string;
    };
    likes:number[]
  }[]
  startDate: string;
  endDate: string;
}
