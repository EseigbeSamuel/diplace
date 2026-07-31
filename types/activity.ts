export interface ActivityProperty {
  public_id: string;
  title: string;
  location: string;
  price: number;
  cost_frequency: string;
  thumbnail: string;
}

export interface ActivityActor {
  public_id: string;
  status: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
}

export interface ActiveActivityItem {
  category: string;
  booking_id: string;
  inspection_id: string;
  is_new: boolean;
  due_date: string;
  property: ActivityProperty;
  actor: ActivityActor;
}

export interface ActiveActivitiesResponse {
  scheduled?: ActiveActivityItem[];
  reserved?: ActiveActivityItem[];
  booked?: ActiveActivityItem[];
  inspected?: ActiveActivityItem[];
}

export interface HistoryActivityItem {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  action: string;
  badge: string;
  title: string;
  description: string;
  occurred_at: string;
  booking_id: string;
  inspection_id: string;
  actor: ActivityActor;
  property: ActivityProperty;
}

export interface HistoryActivitiesResponseItem {
  label: string;
  items: HistoryActivityItem[];
}

export type HistoryActivitiesResponse = HistoryActivitiesResponseItem[];

export interface TodayActivityItem {
  activity_type: string;
  activity_date: string;
  time_label: string;
  booking_id: string;
  inspection_id: string;
  actor: ActivityActor;
  property: ActivityProperty;
}

export type TodayActivitiesResponse = TodayActivityItem[];
