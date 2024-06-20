export function cdnUrl(imagePath, width, height) {
    // Base URL for ImageKit
    const imagekitBaseUrl = 'https://ik.imagekit.io/wo0srdcz6/';
    
    // Create a URL object from the imagePath
    const urlObject = new URL(imagePath);
    
    // Get the pathname from the URL object
    const pathname = urlObject.pathname;

    const pathSegments = urlObject.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];

    // Construct the transformation string
    let transformation = '';
    if (width || height) {
        const transformations = [];
        if (width) {
            transformations.push(`w-${width}`);
        }
        if (height) {
            transformations.push(`h-${height}`);
        }
        transformation = `?tr=${transformations.join(',')}`;
    }

    // Construct the full URL
    // return `${imagekitBaseUrl}${pathname}${transformation}`; //pathname doesn't currently work
    return `${imagekitBaseUrl}${fileName}${transformation}`;
}


