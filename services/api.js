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

// API method for sending OTP
export const sendOtp = async (email, phoneNumber, loginWithEmail) => {
  const payload = {
    email: loginWithEmail ? email : null,
    phone: !loginWithEmail ? phoneNumber : null,
  };
  try {
    const response = await axiosInstance.post('/api/send-otp', payload);
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error sending OTP:', error);
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
    console.log("Api Called")
    const response = await axiosInstance.get(
      `/api/booking/chef-orders/${chef_id}`,
    );
    console.log("Api Called End")
    console.log("Response from fetch orders", response)
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

export const fetchLatestAcceptedOrder = async chef_id => {
  try {
    const response = await axiosInstance.get(
      `/api/booking/latest-accepted-order/${chef_id}`,
    );

    console.log(response)
    return response;
  } catch (error) {
    console.error('Error fetching latest accepted order:', error);
    throw error;
  }
};

// Submit KYC Mail Sent
export const sentKycSubmitMail = async (email, name) => {
  try {
    // Make the API request
    const response = await axiosInstance.post('/api/submit-kyc', { email, name });
    // Log and return the response
    console.log('KYC submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    // Log and throw the error
    console.error('Error submitting KYC:', error);
    throw error;
  }
};

// Start Booking API Call
export const startBooking = async (bookingId) => {
  try {
    console.log("Starting booking with ID:", bookingId);

    const response = await axiosInstance.post(`/api/booking/start-booking/${bookingId}`);
    return response;
  } catch (error) {
    console.error("Error starting booking:", error);
    throw error;
  }
};

export const endBooking = async (bookingId, timeToPrepare) => {
  try {
    const response = await axiosInstance.post('/api/booking/end-booking', {
      booking_id: bookingId,
      time_to_prepare: timeToPrepare,
    });
    return response;
  } catch (error) {
    console.error("Error ending booking:", error);
    throw error;
  }
};

// Function to edit vendor profile
export const editVendorProfile = async (userId, profileData) => {
  const payload = { userId, ...profileData };
  try {
    const response = await axiosInstance.put('/api/auth/edit-vendor-profile', payload);
    console.log("Hello",response)
    return response;
  } catch (error) {
    console.error('Error during vendor profile update:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteUserAccount = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/auth/delete-vendor-account/${userId}`);
    console.log('Account deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error during account deletion:', error.response?.data || error.message);
    throw error;
  }
};

export const checkUserExistence = async (phone) => {
  try {
    const resposne = await axiosInstance.get(`/api/auth/check-user-exist?phone=${phone}`);
    return resposne;
  } catch (error) {
    console.error('Error during account deletion:', error.response?.data || error.message);
  }
}

// API method for sending a login email
export const sendLoginEmail = async (email, ip, device) => {
  try {
    const response = await axiosInstance.post('/api/send-login-email', {
      email,
      ip,
      device,
    });

    return response;
  } catch (error) {
    console.error('Error sending login email:', error);
    throw error;
  }
};

// API method for sending a registration email
export const sendRegisterEmail = async (email, name, ip, device) => {
  try {
    const response = await axiosInstance.post('/api/send-register-email', {
      email,
      name,
      ip,
      device,
    });

    return response;
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};

