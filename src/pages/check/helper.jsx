// ADD: New utility function in ReportPothole.jsx (before component)
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if too large
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

// CHANGE: Update handleFileSelect to compress images
const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
        return toast.error('Maximum 3 images allowed');
    }

    const validFiles = files.filter(f => f.type.startsWith('image/'));

    if (validFiles.length !== files.length) {
        toast.error('Only image files are allowed');
    }

    // CHANGE: Compress each file before adding
    for (const file of validFiles) {
        const compressedBlob = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImages(prev => [...prev, e.target.result]);
            setImageFiles(prev => [...prev, compressedBlob]);
        };
        reader.readAsDataURL(compressedBlob);
    }
};

// CHANGE: Update capturePhoto to compress as well
const capturePhoto = () => {
    if (images.length >= 3) {
        return toast.error('Maximum 3 images allowed');
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // CHANGE: Resize to max 1200px width
    const maxWidth = 1200;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);

    // CHANGE: Use 0.8 quality for compression
    canvas.toBlob((blob) => {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setImageFiles(prev => [...prev, blob]);
        setImages(prev => [...prev, dataUrl]);
        closeCamera();
        toast.success('Photo captured!');
    }, "image/jpeg", 0.8);
};