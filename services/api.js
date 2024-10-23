// API endpoints configuration
const API_BASE_URL = 'https://your-backend-url.com/api';

// API service for color analysis
export const colorAnalysisService = {
  // Analyze image
  async analyzeImage(imageData) {
    try {
      const formData = new FormData();
      formData.append('image', imageData);

      const response = await fetch(`${API_BASE_URL}/analyze/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  },

  // Analyze manual colors
  async analyzeColors(colorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze/colors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colorData),
      });

      if (!response.ok) throw new Error('Color analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Error analyzing colors:', error);
      throw error;
    }
  },

  // Get analysis history
  async getHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
        credentials: 'include', // For handling sessions
      });

      if (!response.ok) throw new Error('Failed to fetch history');
      return await response.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  }
};