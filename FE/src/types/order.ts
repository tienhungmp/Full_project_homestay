export interface OrderRequest {
    userId: string
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    guestCount: number,
    totalPrice: number,
    bookingStatus: string,
    paymentStatus: string,
  }
  
  export interface Order {
    _id: string;
    propertyId: string;
    userId: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    guests: number;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
  }

  export interface BookingRequest {
      propertyId: string;
      checkIn: Date;
      checkOut: Date;
      guestCount: number;
      totalPrice: number;
      bookingStatus: string;
      paymentStatus: string;
      guestName: string;
      guestEmail: string;
      guestPhone: string;
      guestAddress: string;
  }