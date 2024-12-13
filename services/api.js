import axiosInstance from './axiosInstance';

// API method for logging in
export const login = async phoneNumber => {
  const payload = {phone: phoneNumber, role: 'Vendor'};
  try {
    const response = await axiosInstance.post('/api/auth/auth', payload);
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// API method for registering
export const register = async ({name, email, password, phone, role}) => {
  const payload = {name, email, password, phone, role};
  try {
    const response = await axiosInstance.post('/api/auth/auth', payload);
    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// API method for checking KYC status
export const checkKYCStatus = async userId => {
  try {
    const response = await axiosInstance.post('/api/kyc/check-kyc-status', {
      user_id: userId,
    });
    return response;
  } catch (error) {
    console.error('Error checking KYC status:', error);
    throw error;
  }
};

// API method for submitting KYC details
export const submitKYC = async formData => {
  try {
    const response = await axiosInstance.post('/api/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error submitting KYC:', error);
    throw error;
  }
};

export const fetchBookings = async () => {
  try {
    // const response = await axiosInstance.get('/api/booking/fetch-bookings');
    const response = await axiosInstance.get('/api/booking/all-bookings');
    return response;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Approve booking API
export const approveBooking = async (chefId, bookingId) => {
  try {
    console.log(bookingId, chefId)
    const response = await axiosInstance.post('/api/booking/approve-booking', {
      chef_id: chefId,
      booking_id: bookingId,
    });
    return response;
  } catch (error) {
    console.error('Error approving booking:', error);
    throw error;
  }
};

export const fetchChefOrders = async chef_id => {
  try {
    const response = await axiosInstance.get(
      `/api/booking/chef-orders/${chef_id}`,
    );
    return response;
  } catch (error) {
    console.error('Error fetching chef orders:', error);
    throw error;
  }
};

export const cancelOrder = async bookingId => {
  try {
    const response = await axiosInstance.post('/api/booking/cancel-booking', {
      booking_id: bookingId,
    });
    return response;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export const rejectBooking = async (bookingId) => {
  try {
    console.log(bookingId)
    const response = await axiosInstance.post('/api/booking/reject-booking', { booking_id: bookingId });
    console.log("Response api",response.success)
    return response.success;
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return { success: false, message: 'Error rejecting booking' };
  }
};
