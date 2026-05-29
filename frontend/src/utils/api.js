import axios from 'axios'

// AUTH
export const registerUser = (data) => axios.post('/auth/register', data)
export const loginUser = (data) => axios.post('/auth/login', data)
export const verifyEmail = (token) => axios.get(`/auth/verify-email/${token}`)
export const forgotPassword = (data) => axios.post('/auth/forgot-password', data)
export const resetPassword = (token, data) => axios.put(`/auth/reset-password/${token}`, data)
export const getMyProfile = () => axios.get('/auth/me')

// ROUTES
export const getAllRoutes = (params) => axios.get('/routes', { params })
export const getPopularRoutes = () => axios.get('/routes/popular')
export const getSingleRoute = (id) => axios.get(`/routes/${id}`)
export const createRoute = (data) => axios.post('/routes', data)
export const updateRoute = (id, data) => axios.put(`/routes/${id}`, data)
export const deleteRoute = (id) => axios.delete(`/routes/${id}`)
export const deactivateRoute = (id) => axios.put(`/routes/${id}/deactivate`)
export const requestRoute = (data) => axios.post('/routes/request', data)

// BUSES
export const getBusesByRoute = (routeId) => axios.get(`/buses/route/${routeId}`)
export const getSingleBus = (id) => axios.get(`/buses/${id}`)
export const getAllBuses = (params) => axios.get('/buses', { params })
export const createBus = (data) => axios.post('/buses', data)
export const updateBus = (id, data) => axios.put(`/buses/${id}`, data)
export const deleteBus = (id) => axios.delete(`/buses/${id}`)
export const deactivateBus = (id) => axios.put(`/buses/${id}/deactivate`)
export const reassignBus = (id, data) => axios.put(`/buses/${id}/reassign`, data)
export const resetBusSeats = (id) => axios.put(`/buses/${id}/reset-seats`)

// BOOKINGS
export const createBooking = (data) => axios.post('/bookings', data)
export const getMyBookings = () => axios.get('/bookings/my-bookings')
export const getSingleBooking = (id) => axios.get(`/bookings/${id}`)
export const cancelBooking = (id) => axios.put(`/bookings/${id}/cancel`)
export const rescheduleBooking = (id, data) => axios.put(`/bookings/${id}/reschedule`, data)
export const getAllBookings = (params) => axios.get('/bookings', { params })
export const adminCancelBooking = (id, data) => axios.put(`/bookings/${id}/admin-cancel`, data)
export const completeBooking = (id) => axios.put(`/bookings/${id}/complete`)

// REVIEWS
export const createReview = (data) => axios.post('/reviews', data)
export const getRouteReviews = (routeId) => axios.get(`/reviews/route/${routeId}`)
export const getBusReviews = (busId) => axios.get(`/reviews/bus/${busId}`)
export const updateReview = (id, data) => axios.put(`/reviews/${id}`, data)
export const likeReview = (id) => axios.put(`/reviews/${id}/like`)
export const unhelpfulReview = (id) => axios.put(`/reviews/${id}/unhelpful`)
export const adminReplyReview = (id, data) => axios.put(`/reviews/${id}/admin-reply`, data)
export const deleteReview = (id) => axios.delete(`/reviews/${id}`)