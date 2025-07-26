import { logout } from '../redux/userSlice';
import { clearCart } from '../redux/cartSlice';
import { clearWishlist } from '../redux/wishlistSlice';

export const handleLogout = (dispatch, navigate) => {
  // Clear all user-related state
  dispatch(logout());
  dispatch(clearCart());
  dispatch(clearWishlist());
  
  // Navigate to landing page
  if (navigate) {
    navigate('/');
  } else {
    window.location.href = '/';
  }
}; 