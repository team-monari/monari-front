export interface Location {
  id: number;
  locationName: string;
  serviceSubcategory: string;
  serviceStatus: string;
  paymentMethod: string;
  registrationStartDateTime?: string;
  registrationEndDateTime?: string;
  cancellationStartDateTime?: string;
  cancellationEndDateTime?: string;
  cancellationPolicyInfo: string;
  cancellationDeadline: number;
  serviceUrl?: string;
  x: string | undefined;
  y: string | undefined;
}

declare global {
  interface Window {
    kakao: any;
  }
} 