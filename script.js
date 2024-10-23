import { colorAnalysisService } from './services/api.js';
import { imageProcessor } from './utils/imageProcessor.js';

document.addEventListener('DOMContentLoaded', () => {
  const sections = {
    welcome: document.getElementById('welcomeSection'),
    options: document.getElementById('optionsSection'),
    upload: document.getElementById('uploadSection'),
    manual: document.getElementById('manualSection'),
    result: document.getElementById('resultSection')
  };

  // Navigation functions
  const showSection = (sectionToShow) => {
    Object.values(sections).forEach(section => {
      if (section) section.classList.add('hidden');
    });
    if (sections[sectionToShow]) sections[sectionToShow].classList.remove('hidden');
  };

  // Show loading state
  const toggleLoading = (isLoading) => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.disabled = isLoading;
      button.textContent = isLoading ? 'Analyzing...' : button.dataset.originalText;
    });
  };

  // Error handling
  const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  };

  // Button event listeners
  document.getElementById('getStartedBtn')?.addEventListener('click', () => {
    showSection('options');
  });

  document.getElementById('uploadOptionBtn')?.addEventListener('click', () => {
    showSection('upload');
  });

  document.getElementById('manualOptionBtn')?.addEventListener('click', () => {
    showSection('manual');
  });

  // Image upload handling
  const imageUpload = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');

  imageUpload?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      imageProcessor.validateImage(file);
      const compressedImage = await imageProcessor.compressImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(compressedImage);
    } catch (error) {
      showError(error.message);
    }
  });

  // Display results
  const displayResults = (results) => {
    const seasonResult = document.getElementById('seasonResult');
    const colorPalette = document.getElementById('colorPalette');
    
    seasonResult.textContent = `Your color season is: ${results.season}`;
    colorPalette.innerHTML = '';
    
    results.recommendedColors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      colorPalette.appendChild(swatch);
    });

    showSection('result');
  };

  // Analyze manual colors
  const analyzeManualBtn = document.getElementById('analyzeManualBtn');
  analyzeManualBtn?.addEventListener('click', async () => {
    try {
      toggleLoading(true);
      
      const colorData = {
        skin: document.getElementById('skinColor').value,
        eyes: document.getElementById('eyeColor').value,
        hair: document.getElementById('hairColor').value
      };

      const results = await colorAnalysisService.analyzeColors(colorData);
      displayResults(results);
    } catch (error) {
      showError(error.message);
    } finally {
      toggleLoading(false);
    }
  });

  // Analyze uploaded image
  const analyzeUploadBtn = document.getElementById('analyzeUploadBtn');
  analyzeUploadBtn?.addEventListener('click', async () => {
    if (!imagePreview.src) {
      showError('Please upload an image first');
      return;
    }

    try {
      toggleLoading(true);
      const file = imageUpload.files[0];
      const compressedImage = await imageProcessor.compressImage(file);
      const results = await colorAnalysisService.analyzeImage(compressedImage);
      displayResults(results);
    } catch (error) {
      showError(error.message);
    } finally {
      toggleLoading(false);
    }
  });
});