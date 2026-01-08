type User = {
  _id: string,
  email: string,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date
};

type Session = {
  _id: string,
  ipAddress: string,
  userAgent: string,
  createdAt: string,
  expiresAt: string,
  isCurrent?: boolean
};