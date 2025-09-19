export interface Artwork {
  id: number;
  title: string;
  dated: string;
  url: string;
  primaryimageurl: string;
  images: Array<{
    baseimageurl: string;
    iiifbaseuri: string;
    publiccaption?: string;
  }>;
  people: Array<{
    displayname: string;
    role: string;
  }>;
  culture: string;
  medium: string;
  dimensions: string;
  creditline: string;
  classification: string;
  department: string;
}

export interface ArtworkResponse {
  info: {
    totalrecords: number;
    totalrecordsperquery: number;
    page: number;
    pages: number;
  };
  records: Artwork[];
}