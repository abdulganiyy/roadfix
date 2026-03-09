export type Session = {
  user: User;
  accessToken: string;
  //   tokens: {
  //     accessToken: string;
  //     refreshToken: string;
  //   };
};

export type User = {
  id: string;
  image?: string;
  email: string;
  full_name: string;
  phone_number?: string;
  admin_id?: string;
};

export type ResetPasswordFormData = {
  email: string;
  reset_token: string;
  new_password: string;
  new_password_confirm: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
  //   remember: boolean;
};

export type SignUpFormValues = Pick<User, "full_name" | "email">;

export type Menu = {
  id?: string;
  title: string;
  subTitle: string;
  description: string;
  options?: Object[];
  rating?: number;
  price: string;
  category: string | Object;
  tags?: string[];
  imageUrl?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "success" | "failed" | any;
};

export type CreateReport = {
  latitude: number;
  longitude: number;
  gpsAccuracy: number;
  email?: string;
  problemType: string;
  severity: string;
  userId?: string;
  description?: string;
};

export interface Report {
  id: string;
  title: string;
  problemType: string;
  severity: "MINOR" | "MODERATE" | "SEVERE" | "CRITICAL";
  status: "PENDING" | "FIXED" | "VERIFIED" | "REJECTED" | "IN_PROGRESS";
  address: string;
  createdAt: string;
  description: string;
  upvotes?: number;
  image?: string;
  images?: any;
  views?: number;
  comments?: number;
  timeline?: TimelineEvent[];
  submittedBy?: string;
}

export interface TimelineEvent {
  date: string;
  status: string;
  description: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  upvotes: number;
}
