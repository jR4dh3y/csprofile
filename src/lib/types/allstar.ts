export interface AllstarClip {
  _id: string;
  clipUrl: string;
  clipTitle: string;
  clipLength: number;
  clipSnapshotURL: string;
  clipImageThumbURL: string;
  status: 'Submitted' | 'Processed' | 'Error' | 'Pruned';
  createdDate: string;
  shareId: string;
  roundNumber?: number;
  metadata?: AllstarClipMetadata[];
}

export interface AllstarClipMetadata {
  key: string;
  value: string;
}

export interface AllstarClipsResponse {
  message: string;
  requestId: string;
  data: {
    currentPage: number;
    count: number;
    limit: number;
    clips: AllstarClip[];
  };
}

export interface AllstarClipDisplay {
  id: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  duration: number;
  date: string;
  map?: string;
  kills?: string;
}
