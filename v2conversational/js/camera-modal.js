// Camera Modal - Photo capture overlay with AI guidance
// TODO: Implement in Phase 3

export const CameraModal = {
  open: (roomType, instruction) => {
    console.log('Camera modal - Phase 3', roomType, instruction);
  },
  close: () => {
    console.log('Camera modal - Phase 3');
  },
  onPhotosCaptured: (callback) => {
    console.log('Camera modal - Phase 3');
  }
};

window.CameraModal = CameraModal;
