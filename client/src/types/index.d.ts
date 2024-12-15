export interface AuthRequest {
    email: string;
    password: string;
  }
  
  export interface SignupRequest extends AuthRequest {
    name: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
  