export interface StoryInt {
    id: number;
    text: string;
    header: string;
    user: {
      id: number;
      name: string;
    };
    likes: {
      id: number;
      user: {
        id: number;
      };
    }[];
  }